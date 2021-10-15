export function isSelectedRow(state, rowKeyValue) {
    return !!state.selectedRowsKeys[rowKeyValue];
}

export function isDisabledRow(state, rowKeyValue) {
    if (!isSelectedRow(state, rowKeyValue)) {
        const maxRowSelection = getMaxRowSelection(state);

        // W-4819182 when selection is 1, we should not disable selection.
        return (
            maxRowSelection !== 1 &&
            getCurrentSelectionLength(state) === maxRowSelection
        );
    }

    return false;
}

export function getRowSelectionInputType(state) {
    if (getMaxRowSelection(state) === 1) {
        return 'radio';
    }
    return 'checkbox';
}

export function getMaxRowSelection(state) {
    return state.maxRowSelection;
}

export function getCurrentSelectionLength(state) {
    return getSelectedRowsKeys(state).length;
}

export function getSelectedRowsKeys(state) {
    return Object.keys(state.selectedRowsKeys).filter(
        (key) => state.selectedRowsKeys[key]
    );
}
