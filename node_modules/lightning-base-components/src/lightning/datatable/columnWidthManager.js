import {
    getColumnsWidths,
    getResizerDefaultState,
    hasDefinedColumnsWidths,
    isTableRenderedVisible,
} from './resizer';
import { AutoWidthStrategy } from './autoWidthStrategy';
import { FixedWidthStrategy } from './fixedWidthStrategy';
import {
    getRowNumberColumnIndex,
    getAdjustedRowNumberColumnWidth,
} from './rowNumber';
import {
    getColumnWidthFromDef,
    getDomWidth,
    getWidthStyle,
} from './widthManagerShared';
import { isRTL } from 'lightning/utilsPrivate';

const AUTO_WIDTH_MODE = 'auto';
const FIXED_WIDTH_MODE = 'fixed';

const TABLE_SEL = 'table';
const CONTAINER_SEL = '.slds-scrollable_x';
const DATA_CELL_SEL = 'tbody tr:first-child td,tbody tr:first-child th';
const HEADER_CELL_SEL = 'thead tr th lightning-primitive-header-factory';

export function computeColumnWidths(adjustedWidths, columnDefs, widthsData) {
    const { columnWidths } = adjustedWidths;
    if (columnWidths.length !== columnDefs.length) {
        return;
    }
    let columnWidthsSum = 0;
    columnDefs.forEach((columnDef, index) => {
        const newWidth = columnWidths[index];
        widthsData.columnWidths[index] = newWidth;
        columnDef.columnWidth = newWidth;
        columnDef.style = getWidthStyle(newWidth);

        // In RTL, we need to explicitly position the column headers.
        // We do this by providing the offset (in pixels) from the start of the table.
        if (isRTL()) {
            columnDef.offset = columnWidthsSum;
        }

        columnWidthsSum += newWidth;
    });

    // W-7679487 tableWidth should match columnWidthsSum.
    widthsData.tableWidth = columnWidthsSum;
}

export class ColumnWidthManager {
    _columnWidthMode = FIXED_WIDTH_MODE;
    _resizeObserverAvailable = typeof ResizeObserver === 'function';
    // flag to indicate resetting column widths is needed
    // could be with or without autoResizingUpdate
    _queueResizingUpdate = false;
    // flag to indicate whether auto resizing computation update is needed
    // in which case table styles need to auto flow
    _queueAutoResizingUpdate = false;

    constructor(widthsData) {
        const minColumnWidth =
            widthsData.minColumnWidth ||
            getResizerDefaultState().minColumnWidth;
        const maxColumnWidth =
            widthsData.maxColumnWidth ||
            getResizerDefaultState().maxColumnWidth;
        const fixedWidthStrategy = new FixedWidthStrategy(
            minColumnWidth,
            maxColumnWidth
        );
        const autoWidthStrategy = new AutoWidthStrategy(
            minColumnWidth,
            maxColumnWidth
        );
        this._widthStrategies = {};
        this._widthStrategies[FIXED_WIDTH_MODE] = fixedWidthStrategy;
        this._widthStrategies[AUTO_WIDTH_MODE] = autoWidthStrategy;
    }

    // Public apis exposed to datatable

    get columnWidthStrategy() {
        return this._widthStrategies[this.columnWidthMode];
    }

    get columnWidthMode() {
        return this._columnWidthMode;
    }

    set columnWidthMode(value) {
        this._columnWidthMode = value;
    }

    set minColumnWidth(value) {
        Object.keys(this._widthStrategies).forEach((strategy) => {
            this._widthStrategies[strategy].minColumnWidth = value;
        });
    }

    set maxColumnWidth(value) {
        Object.keys(this._widthStrategies).forEach((strategy) => {
            this._widthStrategies[strategy].maxColumnWidth = value;
        });
    }

    set wrapTextMaxLines(value) {
        this._widthStrategies[AUTO_WIDTH_MODE].wrapTextMaxLines = value;
    }

    isResizingUpdateQueued() {
        return this._queueResizingUpdate;
    }

    isAutoResizingUpdateQueued() {
        return this._queueAutoResizingUpdate;
    }

    shouldFireResizeEvent(previousWidthsData, columnDefs) {
        // in fixed widths mode fire resize event only when then
        // column definitions change in number ie. initial render
        // and subsequent changes in column number
        // in auto widths mode dont fire resize event for programmatic
        // actions fire only for user actions
        if (this._columnWidthMode === FIXED_WIDTH_MODE) {
            return (
                getColumnsWidths(previousWidthsData).length !==
                columnDefs.length
            );
        }
        return false;
    }

    adjustColumnsSize(root, columnDefs, widthsData) {
        const {
            _queueResizingUpdate,
            _queueAutoResizingUpdate,
            columnWidthStrategy,
        } = this;
        let adjustedWidths = [];
        if (_queueResizingUpdate) {
            // if table is hidden when updating and ResizeObserver is not available
            // then updating sizes causes min widths to be set
            // hence the check if ok update from dom
            if (this._shouldResizeWithUpdate(root, widthsData)) {
                adjustedWidths = columnWidthStrategy.getAdjustedColumnWidths(
                    this._getDatatableInterface(root),
                    columnDefs,
                    _queueAutoResizingUpdate
                );
            } else {
                // otherwise update from previous widths
                adjustedWidths = {
                    columnWidths: widthsData.columnWidths,
                    expectedTableWidth: widthsData.tableWidth,
                };
            }
            computeColumnWidths(adjustedWidths, columnDefs, widthsData);
        }
        this._resetAutoResizingUpdate();
        this._queueResizingUpdate = false;
    }

    adjustColumnsSizeAfterResize(root, columnDefs, widthsData) {
        const adjustedWidths = this.columnWidthStrategy.getAdjustedColumnWidths(
            this._getDatatableInterface(root),
            columnDefs
        );
        computeColumnWidths(adjustedWidths, columnDefs, widthsData);
    }

    // React to change in data
    handleDataChange(previousData, newData, columnDefs) {
        if (columnDefs.length > 0) {
            // resize columns with auto-resizing update only if -
            // mode is auto and
            // new data length is equal to previous data length (change in data)
            // or previously there was no data at all
            if (this.columnWidthMode === AUTO_WIDTH_MODE) {
                if (this._hasDataChanged(previousData, newData)) {
                    this._queueResizingUpdate = true;
                    this._setAutoResizingUpdate(columnDefs);
                }
            }
        }
    }

    // React to change in column definitions
    handleColumnsChange(columnDefs) {
        if (columnDefs.length > 0) {
            this._queueResizingUpdate = true;
            this._setAutoResizingUpdate(columnDefs);
        }
    }

    // React to change in column widths mode
    handleWidthModeChange(columnDefs) {
        if (columnDefs.length > 0) {
            this._queueResizingUpdate = true;
            this._setAutoResizingUpdate(columnDefs);
        }
    }

    // React to change in row number offset
    handleRowNumberOffsetChange(state, widthsData) {
        const colIndex = getRowNumberColumnIndex(state);
        if (colIndex > -1) {
            const rowNumberCol = state.columns[colIndex];
            const newWidth = getAdjustedRowNumberColumnWidth(state);
            if (rowNumberCol.initialWidth !== newWidth) {
                rowNumberCol.initialWidth = Math.max(
                    newWidth,
                    rowNumberCol.minWidth
                );
                if (hasDefinedColumnsWidths(widthsData)) {
                    // when columns are resized with the resizer, a horizontal scroller appears.
                    // adjusting the columns size, will respect widths already set and try to fit this column
                    this._queueResizingUpdate = true;
                    this._setAutoResizingUpdate(state.columns);
                }
            }
        }
    }

    // React to change in hide-checkbox-column
    handleCheckboxColumnChange(previousValue, newValue, columnDefs) {
        if (columnDefs.length > 0 && previousValue !== newValue) {
            this._queueResizingUpdate = true;
        }
    }

    // React to change in show-row-number-column
    handleRowNumberColumnChange(previousValue, newValue, columnDefs) {
        if (columnDefs.length > 0 && previousValue !== newValue) {
            this._queueResizingUpdate = true;
            this._setAutoResizingUpdate(columnDefs);
        }
    }

    // Private helper functions

    _setAutoResizingUpdate(columnDefs) {
        if (this.columnWidthMode === AUTO_WIDTH_MODE) {
            this._queueAutoResizingUpdate = true;
        }
        if (columnDefs.length > 0) {
            columnDefs.forEach((column) => {
                if (!getColumnWidthFromDef(column)) {
                    column.columnWidth = null;
                    column.style = '';
                }
            });
        }
    }

    _resetAutoResizingUpdate() {
        this._queueAutoResizingUpdate = false;
    }

    _hasDataChanged(previousData, newData) {
        return (
            newData.length > 0 &&
            (previousData.length === 0 ||
                previousData.length === newData.length)
        );
    }

    _shouldResizeWithUpdate(root, widthsData) {
        if (hasDefinedColumnsWidths(widthsData)) {
            // can resize from dom when table is visible
            // otherwise only when ResizeObserver is available in browser
            return (
                isTableRenderedVisible(root) || this._resizeObserverAvailable
            );
        }
        return true;
    }

    _getDatatableInterface(root) {
        return {
            getAvailableWidthFromDom() {
                const container = root.querySelector(CONTAINER_SEL);
                return getDomWidth(container);
            },
            getDataCellWidths() {
                const cells = root.querySelectorAll(DATA_CELL_SEL);
                if (cells.length > 0) {
                    return Array.prototype.slice
                        .call(cells)
                        .reduce((result, cell) => {
                            result.push(cell.offsetWidth);
                            return result;
                        }, []);
                }
                return [];
            },
            getHeaderCellWidths() {
                const headerCells = root.querySelectorAll(HEADER_CELL_SEL);
                if (headerCells.length > 0) {
                    return Array.prototype.slice
                        .call(headerCells)
                        .reduce((result, primitiveCell) => {
                            const headerDomWidth = primitiveCell.getDomWidth();
                            if (headerDomWidth) {
                                result.push(headerDomWidth);
                            }
                            return result;
                        }, []);
                }
                return [];
            },
            getTableElementWidth() {
                const tableElement = root.querySelector(TABLE_SEL);
                return getDomWidth(tableElement);
            },
        };
    }
}
