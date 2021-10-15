import {
    getTotalWidthsMetadata,
    getColumnWidthFromDef,
} from './widthManagerShared';
import { clamp } from './utils';

const MIN_MAX_THRESHOLD = 0.5;
const TRUNCATION_ALLOWANCE = 20;

function hasColumn(columns, colIndex) {
    return columns.some((current) => current === colIndex);
}

function getTotalColumnWidth(columnWidths) {
    return columnWidths.reduce((acc, value) => acc + value, 0);
}

function canRemoveWidth(currentWidth, widthToRemove, minColumnWidth) {
    return currentWidth - widthToRemove >= minColumnWidth;
}

function canAddWidth(currentWidth, widthToAdd, maxColumnWidth) {
    return currentWidth + widthToAdd <= maxColumnWidth;
}

function getExpectedTableWidth(availableWidth, widthsMetadata) {
    const minExpectedTableWidth = getMinExpectedTableWidth(widthsMetadata);
    return hasNoFlexibleColumns(widthsMetadata)
        ? minExpectedTableWidth
        : Math.max(minExpectedTableWidth, availableWidth);
}

function getMinExpectedTableWidth(widthsMetadata) {
    const {
        totalFixedWidth,
        totalResizedWidth,
        totalFlexibleColumns,
        minColumnWidth,
    } = widthsMetadata;
    const minTotalFlexibleWidth = totalFlexibleColumns * minColumnWidth;
    return minTotalFlexibleWidth + totalFixedWidth + totalResizedWidth;
}

function hasNoFlexibleColumns(widthsMetadata) {
    return widthsMetadata.totalFlexibleColumns === 0;
}

export class AutoWidthStrategy {
    // Instance array to hold column width ratios either calculated from visual distribution of column labels
    // or from distribution of data amongst the columns
    // These ratios are reused except when datatable reacts to changes in data or columns and other variables
    // at which point they are recalculated
    _columnWidthRatios = [];
    // Object used to store minColumnWidth, maxColumnWidth along with other metadata like totalFixedColumns
    // refer widthManagerShared getTotalWidthsMetadata
    _columnWidthMetaData = {};
    // Object which holds columns with min width (+ threshold) and columns with max width (-threshold)
    // It is used in redistribution of extra space that is left or taken up while calculating auto widths
    _columnWidthsDistribution = {};

    constructor(minColumnWidth, maxColumnWidth, wrapTextMaxLines = 3) {
        this._columnWidthMetaData = {
            minColumnWidth,
            maxColumnWidth,
            wrapTextMaxLines,
        };
        this.columnWidthsDistribution.colsWithMinWidth = [];
        this.columnWidthsDistribution.colsWithMaxWidth = [];
    }

    set minColumnWidth(value) {
        this._columnWidthMetaData.minColumnWidth = value;
    }

    set maxColumnWidth(value) {
        this._columnWidthMetaData.maxColumnWidth = value;
    }

    set wrapTextMaxLines(value) {
        this._columnWidthMetaData.wrapTextMaxLines = value;
    }

    get columnWidthRatios() {
        return this._columnWidthRatios;
    }

    get columnWidthsDistribution() {
        return this._columnWidthsDistribution;
    }

    /**
     * Get adjusted column widths from existing ratios which are based on data cells room taken
     * or based on column labels space in headers
     * If recomputeAutoWidthRatios is true or ratios are empty, new ratios are calculated
     * Widths are distributed as per defined widths or as per ratio
     * Any remaining space or extra space taken is then redistributed in second pass
     * @param datatableInterface - interface to datatable with callbacks giving width information
     * @param columnDefs - column definitions array with defined widths and other attributes
     * @param recomputeAutoWidthRatios - boolean indicating if ratios should be recalculated
     * @returns {object} with columnWidths: [], expectedTableWidth: (number)
     */
    getAdjustedColumnWidths(
        datatableInterface,
        columnDefs,
        recomputeAutoWidthRatios
    ) {
        const widthsMetadata = getTotalWidthsMetadata(
            this._columnWidthMetaData,
            columnDefs
        );

        const availableWidth = datatableInterface.getAvailableWidthFromDom();

        let expectedTableWidth = getExpectedTableWidth(
            availableWidth,
            widthsMetadata,
            columnDefs
        );

        this._resetColumnWidthsDistribution();

        if (recomputeAutoWidthRatios || this.columnWidthRatios.length === 0) {
            this._calculateColumnWidthRatios(
                datatableInterface,
                columnDefs,
                widthsMetadata
            );
        }

        let columnWidths = [];
        // if the lengths dont match return
        if (
            recomputeAutoWidthRatios &&
            this.columnWidthRatios.length !== columnDefs.length
        ) {
            return { expectedTableWidth, columnWidths };
        }

        // first pass - do distribute widths as per ratios or
        // defined widths if there are any
        columnWidths = this._distributeWidthFromRatios(
            expectedTableWidth,
            columnDefs,
            widthsMetadata
        );

        let columnWidthsSum = getTotalColumnWidth(columnWidths);

        // second pass - there could be excess width remaining due to clamping to maxWidth
        // or we might have used more space due to clamping to minWidth in certain cases
        // this could be more prominent in autoWidthStrategy than in fixedWidthStrategy
        // that columns get extreme widths i.e min or max
        // we need to redistribute this space using below methods
        if (expectedTableWidth > columnWidthsSum) {
            // we have more space lets redistribute space
            this._redistributeExtraWidth(
                expectedTableWidth,
                columnWidths,
                columnDefs
            );
        } else if (expectedTableWidth < columnWidthsSum) {
            // we have to take away used space
            this._redistributeDeficitWidth(
                expectedTableWidth,
                columnWidths,
                columnDefs
            );
        }
        return { columnWidths, expectedTableWidth };
    }

    _getRatios(cellWidths, totalWidth) {
        return cellWidths.map((cellWidth) => {
            return (100 * cellWidth) / totalWidth;
        });
    }

    _calculateColumnWidthRatios(
        datatableInterface,
        columnDefs,
        widthsMetadata
    ) {
        // take into account columns with text wrapping
        const dataCellWidths = datatableInterface
            .getDataCellWidths()
            .map((width, index) => {
                const columnDefinition = columnDefs[index];
                if (columnDefinition && columnDefinition.wrapText) {
                    return width / widthsMetadata.wrapTextMaxLines;
                }
                return width;
            });
        const headerCellWidths = datatableInterface.getHeaderCellWidths();
        const tableScrollWidth = datatableInterface.getTableElementWidth();

        this._setColumnWidthRatios(
            tableScrollWidth,
            dataCellWidths,
            headerCellWidths,
            widthsMetadata
        );
    }

    _setColumnWidthRatios(
        tableScrollWidth,
        dataCellWidths,
        headerCellWidths,
        widthsMetadata
    ) {
        // reset ratios
        this._columnWidthRatios = [];

        if (tableScrollWidth > 0) {
            const { totalFixedWidth, totalResizedWidth } = widthsMetadata;

            if (dataCellWidths.length === 0) {
                if (headerCellWidths.length > 0) {
                    const totalHeaderWidth = headerCellWidths.reduce(
                        (total, width) => {
                            total += width;
                            return total;
                        },
                        0
                    );

                    const totalFlexibleWidth =
                        totalHeaderWidth - totalFixedWidth - totalResizedWidth;
                    // calculate ratio from header cells
                    this._columnWidthRatios = this._getRatios(
                        headerCellWidths,
                        totalFlexibleWidth
                    );
                }
            } else {
                const totalCellWidth = dataCellWidths.reduce((total, width) => {
                    total += width;
                    return total;
                }, 0);
                const totalFlexibleWidth =
                    Math.min(tableScrollWidth, totalCellWidth) -
                    totalFixedWidth -
                    totalResizedWidth;

                // calculate ratio from data cells
                this._columnWidthRatios = this._getRatios(
                    dataCellWidths,
                    totalFlexibleWidth
                );
            }
        }
    }

    _resetColumnWidthsDistribution() {
        this.columnWidthsDistribution.colsWithMinWidth = [];
        this.columnWidthsDistribution.colsWithMaxWidth = [];
    }

    /**
     * Allocates width to a column as per defined width or as per ratio
     * @param availableWidth {number} - available width for the table
     * @param columnDefs {object} - column defs in state
     * @param widthsMetadata {object} - metadata regarding widths includes max, min, flexiblewidth, fixedwidth
     * @private
     */
    _distributeWidthFromRatios(availableWidth, columnDefs, widthsMetadata) {
        const columnWidths = [];
        columnDefs.forEach((column, colIndex) => {
            const width =
                getColumnWidthFromDef(column) ||
                this._getColumnWidthFromRatio(
                    availableWidth,
                    widthsMetadata,
                    colIndex
                );
            columnWidths[colIndex] = width;
        });
        return columnWidths;
    }

    /**
     * Calculates column width of a given column from the ratio
     * Clamps to minColWidth and maxColWidth
     * Also sets housekeeping data for colsWithMaxWidth threshold and colsWithMinWidth threshold
     * @param availableWidth {number} - available width for the table
     * @param widthsMetadata {object} - metadata regarding widths includes max, min, flexiblewidth, fixedwidth
     * @param colIndex {number} - column number
     * @private
     */
    _getColumnWidthFromRatio(availableWidth, widthsMetadata, colIndex) {
        const ratios = this.columnWidthRatios;
        const { colsWithMinWidth, colsWithMaxWidth } =
            this.columnWidthsDistribution;
        const {
            totalFixedWidth,
            totalResizedWidth,
            minColumnWidth,
            maxColumnWidth,
        } = widthsMetadata;
        const totalFlexibleWidth =
            availableWidth - totalFixedWidth - totalResizedWidth;

        let calculatedWidth = Math.floor(
            (totalFlexibleWidth * ratios[colIndex]) / 100
        );

        calculatedWidth = calculatedWidth + TRUNCATION_ALLOWANCE;

        const minWidthThreshold =
            minColumnWidth + Math.ceil(MIN_MAX_THRESHOLD * minColumnWidth);
        const maxWidthThreshold =
            maxColumnWidth - Math.ceil(MIN_MAX_THRESHOLD * maxColumnWidth);

        if (calculatedWidth < minWidthThreshold) {
            colsWithMinWidth.push(colIndex);
        }

        if (calculatedWidth > maxWidthThreshold) {
            colsWithMaxWidth.push(colIndex);
        }

        return clamp(calculatedWidth, minColumnWidth, maxColumnWidth);
    }

    /**
     * This method gives extra width that was remaining by
     * first giving width to columns with max width or within threshold of max width
     * then by giving from all columns possible - excluding fixed width columns, columns that
     * can become max width after redistribution
     * @param expectedTableWidth {number} - width taken by the table in the dom
     * @param columnWidths {array} - widths array
     * @param columnDefs {array} - columnDefs from state
     * @private
     */
    _redistributeExtraWidth(expectedTableWidth, columnWidths, columnDefs) {
        const { colsWithMinWidth } = this.columnWidthsDistribution;

        const widthsMetadata = getTotalWidthsMetadata(
            this._columnWidthMetaData,
            columnDefs
        );
        const { maxColumnWidth, totalResizedColumns, totalFixedColumns } =
            widthsMetadata;

        let columnWidthsSum = getTotalColumnWidth(columnWidths);
        let extraSpace = expectedTableWidth - columnWidthsSum;
        let totalColsToDistribute = 0;
        let extraWidthPerColumn = 0;

        // first distribute space to columns with min width or threshold of min width
        if (colsWithMinWidth.length > 0) {
            totalColsToDistribute = colsWithMinWidth.length;
            extraWidthPerColumn = Math.floor(
                extraSpace / totalColsToDistribute
            );
            colsWithMinWidth.forEach((colIndex) => {
                const currentWidth = columnWidths[colIndex];
                if (
                    canAddWidth(
                        currentWidth,
                        extraWidthPerColumn,
                        maxColumnWidth
                    )
                ) {
                    const newWidth = currentWidth + extraWidthPerColumn;
                    columnWidthsSum += extraWidthPerColumn;
                    columnWidths[colIndex] = newWidth;
                }
            });
        }

        extraSpace = expectedTableWidth - columnWidthsSum;
        const totalFixedWidthColumns = totalResizedColumns + totalFixedColumns;

        // now distribute to every column possible excluding columns with defined widths
        // after this distribution its still possible we might have more space remaining
        // since we couldnt add widths to majority of columns
        if (extraSpace > 0) {
            totalColsToDistribute = columnDefs.length - totalFixedWidthColumns;

            extraWidthPerColumn = Math.floor(
                extraSpace / totalColsToDistribute
            );
            columnDefs.forEach((column, colIndex) => {
                const currentWidth = columnWidths[colIndex];

                if (
                    !getColumnWidthFromDef(column) &&
                    canAddWidth(
                        currentWidth,
                        extraWidthPerColumn,
                        maxColumnWidth
                    )
                ) {
                    const newWidth = currentWidth + extraWidthPerColumn;
                    columnWidthsSum += extraWidthPerColumn;
                    columnWidths[colIndex] = newWidth;
                }
            });
        }
    }

    /**
     * This method removes extra space that was taken by
     * first taking away width from columns with max width or within threshold of max width
     * then by taking away from all columns possible - excluding fixed width columns, column with min width or
     * can become min width after taking away
     * @param expectedTableWidth {number} - width taken by the table in the dom
     * @param columnWidths - widths array
     * @param columnDefs - columnDefs from state
     * @private
     */
    _redistributeDeficitWidth(expectedTableWidth, columnWidths, columnDefs) {
        const { colsWithMinWidth, colsWithMaxWidth } =
            this.columnWidthsDistribution;
        const widthsMetadata = getTotalWidthsMetadata(
            this._columnWidthMetaData,
            columnDefs
        );
        const { minColumnWidth, totalResizedColumns, totalFixedColumns } =
            widthsMetadata;

        let columnWidthsSum = getTotalColumnWidth(columnWidths);
        let extraSpace = expectedTableWidth - columnWidthsSum;
        let totalColsToDistribute = 0;
        let extraWidthPerColumn = 0;

        // first take away width from columns with max width or threshold of max width
        if (colsWithMaxWidth.length > 0) {
            totalColsToDistribute = colsWithMaxWidth.length;
            extraWidthPerColumn = Math.floor(
                Math.abs(extraSpace) / totalColsToDistribute
            );
            colsWithMaxWidth.forEach((colIndex) => {
                const currentWidth = columnWidths[colIndex];

                if (
                    canRemoveWidth(
                        currentWidth,
                        extraWidthPerColumn,
                        minColumnWidth
                    )
                ) {
                    const newWidth = currentWidth - extraWidthPerColumn;
                    columnWidthsSum -= extraWidthPerColumn;
                    columnWidths[colIndex] = newWidth;
                }
            });
        }

        extraSpace = expectedTableWidth - columnWidthsSum;
        const totalFixedWidthColumns = totalResizedColumns + totalFixedColumns;

        // now from every column possible excluding columns with defined widths
        // and excluding columns within minWidthThreshold
        // after this distribution its still possible we might have used more space
        // since we couldnt take away widths from majority of columns
        if (extraSpace < 0) {
            totalColsToDistribute =
                columnDefs.length -
                (totalFixedWidthColumns + colsWithMinWidth.length);
            extraWidthPerColumn = Math.floor(
                Math.abs(extraSpace) / totalColsToDistribute
            );
            columnDefs.forEach((column, colIndex) => {
                const currentWidth = columnWidths[colIndex];

                if (
                    !getColumnWidthFromDef(column) &&
                    !hasColumn(colsWithMinWidth, colIndex) &&
                    canRemoveWidth(
                        currentWidth,
                        extraWidthPerColumn,
                        minColumnWidth
                    )
                ) {
                    const newWidth = currentWidth - extraWidthPerColumn;
                    columnWidthsSum -= extraWidthPerColumn;
                    columnWidths[colIndex] = newWidth;
                }
            });
        }
    }
}
