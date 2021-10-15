export function isCustomerColumn(column) {
    return column.internal !== true;
}

export function getColumns(state) {
    return state.columns;
}

export function getColumnName(column) {
    return column.columnKey || column.fieldName;
}
