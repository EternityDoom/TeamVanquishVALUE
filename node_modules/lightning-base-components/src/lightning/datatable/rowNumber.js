import { normalizeNumberAttribute } from './utils';
import labelRowLevelErrorAssistiveText from '@salesforce/label/LightningDatatable.rowLevelErrorAssistiveText';
import labelRowNumber from '@salesforce/label/LightningDatatable.rowNumber';
import { formatLabel } from 'lightning/utils';
import { normalizeBoolean } from 'lightning/utilsPrivate';

const CHAR_WIDTH = 10;
const ROWNUMBER_PADDING = 12;
const TOOLTIP_ALLOWANCE = 20;
const COLUMN_TYPE = 'rowNumber';
const i18n = {
    rowLevelErrorAssistiveText: labelRowLevelErrorAssistiveText,
    rowNumber: labelRowNumber,
};

export function isRowNumberColumn(column) {
    return column.type === COLUMN_TYPE;
}

export function getRowNumberColumnDef() {
    return {
        type: COLUMN_TYPE,
        ariaLabel: i18n.rowNumber,
        sortable: false,
        initialWidth: 52,
        minWidth: 52,
        maxWidth: 1000,
        tabIndex: -1,
        internal: true,
        resizable: false,
    };
}

export function getRowNumberState() {
    return {
        showRowNumberColumn: false,
        rowNumberOffset: 0,
    };
}

/**
 * showRowNumberColumn
 */
export function hasRowNumberColumn(state) {
    return state.showRowNumberColumn;
}
export function setShowRowNumberColumn(state, value) {
    state.showRowNumberColumn = normalizeBoolean(value);
}

/**
 * rowNumberOffset
 */

export function getRowNumberOffset(state) {
    return state.rowNumberOffset;
}
export function setRowNumberOffset(state, value) {
    state.rowNumberOffset = normalizeNumberAttribute(
        'rowNumberOffset',
        value,
        'non-negative',
        getRowNumberState().rowNumberOffset
    );
}

export function getAdjustedRowNumberColumnWidth(state) {
    const numOfRows = state.rows.length;
    const offset = state.rowNumberOffset;
    const numberOfChars = String(numOfRows + offset).length;
    return Math.max(
        CHAR_WIDTH * numberOfChars +
            ROWNUMBER_PADDING /* padding */ +
            TOOLTIP_ALLOWANCE /* primitive-tootlip */,
        getRowNumberColumnDef().initialWidth
    );
}

export function getRowNumberColumnIndex(state) {
    if (hasRowNumberColumn(state) && state.columns.length > 0) {
        const columns = state.columns;
        for (let i = 0; i < columns.length; i++) {
            const column = columns[i];
            if (column.type === COLUMN_TYPE) {
                return i;
            }
        }
    }
    return -1;
}

export function getRowNumberErrorColumnDef(rowErrors, rowTitle) {
    const { title, messages } = rowErrors;

    const numberOfErrors = rowErrors.cells
        ? Object.keys(rowErrors.cells).length
        : rowErrors.fieldNames
        ? rowErrors.fieldNames.length
        : 0;

    const alternativeText = formatLabel(
        i18n.rowLevelErrorAssistiveText,
        rowTitle || '',
        numberOfErrors
    );

    return {
        type: COLUMN_TYPE,
        typeAttributes: {
            error: { title, messages, alternativeText },
        },
    };
}
