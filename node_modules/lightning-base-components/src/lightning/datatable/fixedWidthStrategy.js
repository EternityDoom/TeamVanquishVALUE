import {
    getTotalWidthsMetadata,
    getColumnWidthFromDef,
} from './widthManagerShared';

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

export class FixedWidthStrategy {
    _columnWidthMetaData = {};

    constructor(minColumnWidth, maxColumnWidth) {
        this._columnWidthMetaData = { minColumnWidth, maxColumnWidth };
    }

    set minColumnWidth(value) {
        this._columnWidthMetaData.minColumnWidth = value;
    }

    set maxColumnWidth(value) {
        this._columnWidthMetaData.maxColumnWidth = value;
    }

    /**
     * Get adjusted column widths either from defined widths in columnDefs or by dividing total width
     * equally amongst the possible columns
     * @param datatableInterface - interface to datatable with callbacks giving width information
     * @param columnDefs - column definitions array with defined widths and other attributes
     * @returns {object} with columnWidths: [], expectedTableWidth: (number)
     */
    getAdjustedColumnWidths(datatableInterface, columnDefs) {
        const widthsMetadata = getTotalWidthsMetadata(
            this._columnWidthMetaData,
            columnDefs
        );
        const availableWidth = datatableInterface.getAvailableWidthFromDom();
        const expectedTableWidth = getExpectedTableWidth(
            availableWidth,
            widthsMetadata
        );

        const expectedFlexibleColumnWidth = this._getFlexibleColumnWidth(
            widthsMetadata,
            expectedTableWidth
        );

        const columnWidths = [];
        columnDefs.forEach((column, colIndex) => {
            const width =
                getColumnWidthFromDef(column) || expectedFlexibleColumnWidth;
            columnWidths[colIndex] = width;
        });

        return { columnWidths, expectedTableWidth };
    }

    _getFlexibleColumnWidth(widthsMetadata, totalTableWidth) {
        const {
            totalFixedWidth,
            totalResizedWidth,
            totalFlexibleColumns,
            minColumnWidth,
            maxColumnWidth,
        } = widthsMetadata;
        const totalFlexibleWidth =
            totalTableWidth - totalFixedWidth - totalResizedWidth;
        const avgFlexibleColumnWidth = Math.floor(
            totalFlexibleWidth / totalFlexibleColumns
        );
        const allowedSpace = Math.max(avgFlexibleColumnWidth, minColumnWidth);
        return Math.min(maxColumnWidth, allowedSpace);
    }
}
