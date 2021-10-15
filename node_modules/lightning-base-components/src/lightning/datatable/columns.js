import { normalizeBoolean } from 'lightning/utilsPrivate';
import { isObjectLike } from './utils';
import {
    getRowNumberColumnDef,
    hasRowNumberColumn,
    setShowRowNumberColumn,
} from './rowNumber';
import { isTreeType, isValidTypeForTree } from './types';
import { updateColumnSortingState } from './sort';
import { generateColKeyValue } from './keys';
import rowActionsDefaultAriaLabel from '@salesforce/label/LightningDatatable.rowActionsDefaultAriaLabel';
import { getColumns, isCustomerColumn } from './columns-shared';

export { getColumns, isCustomerColumn } from './columns-shared';

const i18n = {
    rowActionsDefaultAriaLabel,
};

export function getColumnsDefaultState() {
    return {
        columns: [],
    };
}

export function hasColumns(state) {
    return getColumns(state).length > 0;
}

export const SELECTABLE_ROW_CHECKBOX = 'SELECTABLE_CHECKBOX';

const SELECTABLE_COLUMN = {
    type: SELECTABLE_ROW_CHECKBOX,
    fixedWidth: 32,
    tabIndex: -1,
    internal: true,
};

export function hasEditableColumn(columns) {
    return columns.some((column) => column.editable);
}

/**
 * Given an array of column definitions, returns a filtered array containing only those
 * elements from the original array that are editable. For any two columns, C_1 and C_2,
 * that are present in both the input and output array, the relative ordering between
 * them that existed in the input array is maintained in the output array.
 *
 * @param {Array} columns - the datatable's column definitions. Must be truthy and must be
 *                          filled with truthy column definition objects.
 */
export function getEditableColumns(columns) {
    return columns.filter((column) => column.editable);
}

/**
 * Normalizes the editable property of the column after checking whether the column type
 * is a valid editable standard type or if it's a customType and uses standardCellLayout.
 * If column.editable is associated with an object that also has a 'fieldName' key, then
 * the invocation of this function results in a no-op because we instead rely on later
 * row level checks to determine cell editability.
 *
 * @param {Object} column column metadata
 * @param {Object} types the DatatableTypes object
 */
export function normalizeEditable(column, types) {
    if (types.isEditableType(column.type)) {
        if (
            !(typeof column.editable === 'object' && column.editable.fieldName)
        ) {
            column.editable = normalizeBoolean(column.editable);
        }
        column.editTemplate = types.getCustomTypeEditTemplate(column.type);
    } else {
        column.editable = false;
        column.editTemplate = undefined;
    }
}

export function normalizeColumns(state, columns, types) {
    if (columns.length !== 0) {
        let firstColumnForReaders = 0;
        // workaround https://git.soma.salesforce.com/raptor/raptor/issues/763
        const normalizedColumns = Object.assign([], columns);

        if (!state.hideCheckboxColumn) {
            firstColumnForReaders++;
            normalizedColumns.unshift(SELECTABLE_COLUMN);
        }

        if (hasRowNumberColumn(state) || hasEditableColumn(columns)) {
            firstColumnForReaders++;
            setShowRowNumberColumn(state, true);
            normalizedColumns.unshift(getRowNumberColumnDef());
        }

        const columnKeyMap = {};
        state.columns = normalizedColumns.map((column, index) => {
            // Verify columnKey is unique
            const columnKey = column.columnKey;
            if (columnKey && columnKeyMap[columnKey]) {
                console.error(
                    `The "columnKey" column property must be unique. Found a duplicate of columnKey "${columnKey}".`
                );
            }
            columnKeyMap[columnKey] = true;

            const normalizedColumn = Object.assign(
                getColumnDefaults(column),
                column
            );
            normalizedColumn.ariaLabel =
                normalizedColumn.label || normalizedColumn.ariaLabel || null;
            // customType attribute is needed to render default iedit component
            normalizedColumn.editableCustomType =
                types.isStandardCellLayoutForCustomType(normalizedColumn.type);

            if (isCustomerColumn(normalizedColumn)) {
                normalizeColumnDataType(normalizedColumn, types);
                normalizeEditable(normalizedColumn, types);
                updateColumnSortingState(normalizedColumn, state);
            }

            if (isTreeType(normalizedColumn.type)) {
                normalizedColumn.typeAttributes = getNormalizedSubTypeAttribute(
                    normalizedColumn.type,
                    normalizedColumn.typeAttributes
                );
            }
            return Object.assign(normalizedColumn, {
                tabIndex: -1,
                colKeyValue: generateColKeyValue(normalizedColumn, index),
                isScopeCol: index === firstColumnForReaders,
            });
        });
    } else {
        state.columns = [];
    }
}

function normalizeColumnDataType(column, types) {
    if (!types.isValidType(column.type)) {
        column.type = getRegularColumnDefaults().type;
    }
}

/**
 * Normalizes the subType and subTypeAttributes in the typeAttributes.
 * @param {String} type the type of this column
 * @param {Object} typeAttributes the type attributes of the column
 * @returns {Object} a new typeAttributes object with the sybtype and subTypeAttributes normalized.
 */
export function getNormalizedSubTypeAttribute(type, typeAttributes) {
    const typeAttributesOverrides = {};
    if (!isValidTypeForTree(typeAttributes.subType)) {
        typeAttributesOverrides.subType = getColumnDefaults({ type }).subType;
    }
    if (!typeAttributes.subTypeAttributes) {
        typeAttributesOverrides.subTypeAttributes = {};
    }

    return Object.assign({}, typeAttributes, typeAttributesOverrides);
}

function getRegularColumnDefaults() {
    return {
        type: 'text',
        typeAttributes: {},
        cellAttributes: {},
    };
}

function getActionColumnDefaults() {
    return {
        fixedWidth: 50,
        resizable: false,
        ariaLabel: i18n.rowActionsDefaultAriaLabel,
    };
}

function getTreeColumnDefaults() {
    return {
        type: 'tree',
        subType: 'text',
        typeAttributes: {},
        cellAttributes: {},
    };
}

function getColumnDefaults(column) {
    switch (column.type) {
        case 'action':
            return getActionColumnDefaults();
        case 'tree':
            return getTreeColumnDefaults();
        default:
            return getRegularColumnDefaults();
    }
}

export function getTypeAttributesValues(column) {
    if (isObjectLike(column.typeAttributes)) {
        return column.typeAttributes;
    }
    return {};
}

export function getSubTypeAttributesValues(column) {
    if (isObjectLike(column.typeAttributes.subTypeAttributes)) {
        return column.typeAttributes.subTypeAttributes;
    }
    return {};
}

export function getCellAttributesValues(column) {
    if (isObjectLike(column.cellAttributes)) {
        return column.cellAttributes;
    }
    return {};
}

/**
 * Return the index in dt.columns (user definition) related to colKeyValue.
 *      -1 if no column with that key exist or if its internal.
 * @param {Object} state The datatable state
 * @param {String} colKeyValue The generated key for the column
 * @return {Number} The index in dt.columns. -1 if not found or if its internal.
 */
export function getUserColumnIndex(state, colKeyValue) {
    const stateColumnIndex = getStateColumnIndex(state, colKeyValue);
    let internalColumns = 0;

    if (state.columns[stateColumnIndex].internal) {
        return -1;
    }

    for (let i = 0; i < stateColumnIndex; i++) {
        if (state.columns[i].internal) {
            internalColumns++;
        }
    }

    return stateColumnIndex - internalColumns;
}

/**
 * Return the index in state.columns (internal definition) related to colKeyValue.
 *
 * @param {Object} state The datatable state
 * @param {String} colKeyValue The generated key for the column
 * @return {number} The index in state.columns.
 */
export function getStateColumnIndex(state, colKeyValue) {
    return state.headerIndexes[colKeyValue];
}

/**
 *
 * @param {Object} state - The datatable state
 * @param {String} key - the key of the column. Defaults to field name if 'columnKey' is not provided.
 * @returns {number} The index in state.columns, -1 if it does not exist
 */
export function getColumnIndexByColumnKey(state, key) {
    let i = 0;
    const columns = getColumns(state);
    const existFieldName = columns.some((column, index) => {
        i = index;
        return (
            column.columnKey === key ||
            (!column.columnKey && column.fieldName === key)
        );
    });

    return existFieldName ? i : -1;
}
