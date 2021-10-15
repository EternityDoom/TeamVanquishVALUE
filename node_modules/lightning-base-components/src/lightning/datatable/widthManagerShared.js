export function getTotalWidthsMetadata(columnWidthMetaData, columnDefs) {
    const initial = {
        totalFixedWidth: 0,
        totalFixedColumns: 0,
        totalResizedWidth: 0,
        totalResizedColumns: 0,
        totalFlexibleColumns: 0,
        minColumnWidth: columnWidthMetaData.minColumnWidth,
        maxColumnWidth: columnWidthMetaData.maxColumnWidth,
        wrapTextMaxLines: columnWidthMetaData.wrapTextMaxLines,
    };

    return columnDefs.reduce((prev, col) => {
        if (col.fixedWidth) {
            prev.totalFixedWidth += col.fixedWidth;
            prev.totalFixedColumns += 1;
        } else if (col.isResized) {
            prev.totalResizedWidth += col.columnWidth;
            prev.totalResizedColumns += 1;
        } else if (col.initialWidth) {
            prev.totalResizedWidth += col.initialWidth;
            prev.totalResizedColumns += 1;
        } else {
            prev.totalFlexibleColumns += 1;
        }
        return prev;
    }, initial);
}

/**
 * Get width of dom element.
 * @param  {node} element - target dom element
 * @returns {number} - integer width of element
 */
export function getDomWidth(element) {
    return element.offsetWidth;
}

export function getColumnWidthFromDef(column) {
    let resizedWidth;
    if (column.isResized) {
        resizedWidth = column.columnWidth;
    }
    return column.fixedWidth || resizedWidth || column.initialWidth;
}

export function getWidthStyle(pixels) {
    return pixels > 0 ? `width:${pixels}px` : '';
}
