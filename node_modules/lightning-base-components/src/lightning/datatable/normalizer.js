import { generateColKeyValue } from './keys';

export const getDefaultState = function () {
    return {
        // columns
        columns: [],

        // rows
        data: [],
        keyField: undefined,
        rows: [],
        indexes: {},

        // selector
        selectedRowsKeys: {},
        maxRowSelection: undefined,

        headerIndexes: {},

        // keyboard
        keyboardMode: 'NAVIGATION',
        rowMode: false,
        activeCell: undefined,
        tabindex: 0,
        cellToFocusNext: null,
        cellClicked: false,
        normalized: false,

        // header actions
        wrapText: {},

        // sort
        sortedBy: undefined,
        sortedDirection: undefined,
        defaultSortDirection: 'asc',

        // row number
        showRowNumberColumn: false,
        rowNumberOffset: 0,

        // resizer
        resizeColumnDisabled: false,
        resizeStep: 10,
        columnWidths: [],
        tableWidth: 0,
        minColumnWidth: 50,
        maxColumnWidth: 1000,
        columnWidthsMode: 'fixed',

        // infinite loading
        enableInfiniteLoading: false,
        loadMoreOffset: 20,
        isLoading: false,

        // inline edit
        inlineEdit: {
            dirtyValues: {},
        },

        // errors
        errors: {
            rows: {},
            table: {},
        },

        hideTableHeader: false,
        wrapTextMaxLines: undefined,
    };
};

/**
 * It generate headerIndexes based in the current metadata
 * headerIndexes represent the position of the header(column)
 * based on the unique colKeyValue
 * @param {object} columns - the current normalized column metadata
 * @returns {object} headerIndexes e.g. { 'name-text' 0, 'amount-number': 1 }
 */
export const generateHeaderIndexes = function (columns) {
    return columns.reduce((prev, col, index) => {
        prev[generateColKeyValue(col, index)] = index;
        return prev;
    }, {});
};
