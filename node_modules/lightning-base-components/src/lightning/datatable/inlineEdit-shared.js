export function getDirtyValue(state, rowKeyValue, colKeyValue) {
    const dirtyValues = state.inlineEdit.dirtyValues;

    if (
        // eslint-disable-next-line no-prototype-builtins
        dirtyValues.hasOwnProperty(rowKeyValue) &&
        // eslint-disable-next-line no-prototype-builtins
        dirtyValues[rowKeyValue].hasOwnProperty(colKeyValue)
    ) {
        return dirtyValues[rowKeyValue][colKeyValue];
    }

    return undefined;
}
