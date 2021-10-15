import { normalizeBoolean, isRTL } from 'lightning/utilsPrivate';
import { isCustomerColumn } from './columns-shared';
import { clamp, normalizeNumberAttribute } from './utils';

/**
 * It return the default portion of state use it for the resizer
 * @returns {{resizer: {columnWidths: Array}}} - resizer default state
 */
export function getResizerDefaultState() {
    return {
        resizeColumnDisabled: false,
        resizeStep: 10,
        columnWidths: [],
        tableWidth: 0,
        minColumnWidth: 50,
        maxColumnWidth: 1000,
        columnWidthsMode: 'fixed',
    };
}

// *******************************
// states Getters/Setters
// *******************************

/**
 * resizeColumnDisabled
 */

export function isResizeColumnDisabled(widthsData) {
    return widthsData.resizeColumnDisabled;
}
export function setResizeColumnDisabled(widthsData, value) {
    widthsData.resizeColumnDisabled = normalizeBoolean(value);
}

/**
 * resizeStep
 */

export function setResizeStep(widthsData, value) {
    widthsData.resizeStep = normalizeNumberAttribute(
        'resizeStep',
        value,
        'non-negative',
        getResizerDefaultState().resizeStep
    );
}
export function getResizeStep(widthsData) {
    return widthsData.resizeStep;
}

/**
 * columnWidths
 */

/**
 * It return true if there are widths store in the state
 * @param {object} widthsData - data regarding column and table widths
 * @returns {boolean} - true if there are widths store in the state
 */
export function hasDefinedColumnsWidths(widthsData) {
    return widthsData.columnWidths.length > 0;
}
/**
 * It return the columnsWidths saved in the state
 * @param {object} widthsData - data regarding column and table widths
 * @returns {Array|*} - list of column widths
 */
export function getColumnsWidths(widthsData) {
    return widthsData.columnWidths;
}
/**
 * It set columnWidths to empty array
 * @param {object} widthsData - data regarding column and table widths
 */
export function resetColumnWidths(widthsData) {
    widthsData.columnWidths = [];
}

/**
 * tableWidth
 */

/**
 * Get the full width of table
 * @param {object} widthsData - data regarding column and table widths
 * @returns {number} - table's width
 */
function getTableWidth(widthsData) {
    return widthsData.tableWidth;
}
function setTableWidth(widthsData, tableWidth) {
    widthsData.tableWidth = tableWidth;
}

/**
 * minColumnWidth
 */

export function setMinColumnWidth(state, widthsData, value) {
    widthsData.minColumnWidth = normalizeNumberAttribute(
        'minColumnWidth',
        value,
        'non-negative',
        getResizerDefaultState().minColumnWidth
    );

    updateColumnWidthsMetadata(state, widthsData);
}
export function getMinColumnWidth(widthsData) {
    return widthsData.minColumnWidth;
}

/**
 * maxColumnWidth
 */

export function getMaxColumnWidth(widthsData) {
    return widthsData.maxColumnWidth;
}
export function setMaxColumnWidth(state, widthsData, value) {
    widthsData.maxColumnWidth = normalizeNumberAttribute(
        'maxColumnWidth',
        value,
        'non-negative',
        getResizerDefaultState().maxColumnWidth
    );

    updateColumnWidthsMetadata(state, widthsData);
}

// *******************************
// Logics
// *******************************

/**
 * Get the style to match the full width of table
 * @param {object} widthsData - data regarding column and table widths
 * @returns {string} - style string
 */
export function getTableWidthStyle(widthsData) {
    return getWidthStyle(getTableWidth(widthsData));
}

/**
 * - It adjusts the columns widths from the state
 * - It is used when there are columnwidths in state but the table is hidden with offsetwidth 0
 * - In this case we reset the columns to the width in state
 *
 * @param {object} state - table state
 */
export const adjustColumnsSizeFromState = function (state) {
    const columnsWidths = getColumnsWidths(state);
    let columnsWidthSum = 0;
    getColumns(state).forEach((column, colIndex) => {
        const width = columnsWidths[colIndex];
        if (typeof columnsWidths[colIndex] !== 'undefined') {
            if (isRTL()) {
                column.offset = columnsWidthSum;
            }
            columnsWidthSum += width;
            column.columnWidth = columnsWidths[colIndex];
            column.style = getWidthStyle(columnsWidths[colIndex]);
        }
    });
    setTableWidth(state, columnsWidthSum);
};

/**
 * It resize a column width
 * @param {object} state - table state
 * @param {number} colIndex - the index of the column based on state.columns
 * @param {number} width - the new width is gonna be applied
 */
export const resizeColumn = function (state, widthsData, colIndex, width) {
    const column = getColumns(state)[colIndex];
    const columnsWidths = getColumnsWidths(widthsData);
    const currentWidth = columnsWidths[colIndex];
    const { minWidth, maxWidth } = column;

    const newWidth = clamp(width, minWidth, maxWidth);
    if (currentWidth !== newWidth) {
        const newDelta = newWidth - currentWidth;
        setTableWidth(widthsData, getTableWidth(widthsData) + newDelta);
        updateColumnWidth(state, widthsData, colIndex, newWidth);
        // Workaround for header positioning issues in RTL
        updateColumnOffsets(state, colIndex + 1, newDelta);
        column.isResized = true;
    }
};

/**
 * It resize a column width
 * @param {object} state - table state
 * @param {object} widthsData - data regarding column and table widths
 * @param {number} colIndex - the index of the column based on state.columns
 * @param {number} widthDelta - the delta that creates the new width
 */
export const resizeColumnWithDelta = function (
    state,
    widthsData,
    colIndex,
    widthDelta
) {
    const currentWidth = getColumnsWidths(widthsData)[colIndex];
    resizeColumn(state, widthsData, colIndex, currentWidth + widthDelta);
};

function updateColumnWidth(state, widthsData, colIndex, newWidth) {
    const columnsWidths = getColumnsWidths(widthsData);
    columnsWidths[colIndex] = newWidth;

    const column = getColumns(state)[colIndex];
    column.columnWidth = newWidth;
    column.style = getWidthStyle(newWidth);
}

/**
 * It return the current widths for customer columns
 * @param {object} state - table state
 * @param {object} widthsData - data regarding column and table widths
 * @returns {Array} - the widths collection, every element
 * belong to a column with the same index in column prop
 */
export function getCustomerColumnWidths(state, widthsData) {
    const columns = getColumns(state);
    return columns.reduce((prev, column, index) => {
        if (isCustomerColumn(column)) {
            prev.push(widthsData.columnWidths[index]);
        }
        return prev;
    }, []);
}

export function updateColumnWidthsMetadata(state, widthsData) {
    getColumns(state).forEach((col) => {
        if (!col.internal) {
            col.minWidth = getMinColumnWidth(widthsData);
            col.maxWidth = getMaxColumnWidth(widthsData);
        }

        if (col.initialWidth) {
            col.initialWidth = clamp(
                col.initialWidth,
                col.minWidth,
                col.maxWidth
            );
        }
    });
}

/**
 * It returns if table is rendered and not hidden
 * @param {node} root - table root element
 * @returns {boolean} - true or false if dt is rendered and not hidden on the page
 */
export function isTableRenderedVisible(root) {
    const CONTAINER_SEL = '.slds-scrollable_y';
    const elem = root.querySelector(CONTAINER_SEL);
    return (
        elem && !!(elem.offsetParent || elem.offsetHeight || elem.offsetWidth)
    );
}

function getWidthStyle(pixels) {
    return pixels > 0 ? `width:${pixels}px` : '';
}

function getColumns(state) {
    return state.columns;
}

/**
 * Updates the column offsets based on the specified delta, starting from the specified index.
 * This is used to position the column headers properly in RTL.
 *
 * @param {object} state
 * @param {number} colIndex - The first index to start applying the change in column width
 * @param {number} newDelta - The change in column width to apply to
 */
function updateColumnOffsets(state, colIndex, newDelta) {
    if (isRTL()) {
        const columns = getColumns(state).slice(colIndex);
        columns.forEach((column) => {
            column.offset += newDelta;
        });
    }
}
