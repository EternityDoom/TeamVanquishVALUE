import { getScrollOffsetFromTableEnd } from './utils';
import { LightningResizeObserver } from 'lightning/resizeObserver';
import { normalizeBoolean } from 'lightning/utilsPrivate';

const BUFFER_ROW_COUNT = 5;
const DEFAULT_ROW_HEIGHT = 30;
const DEFAULT_SCROLL_THRESHOLD = 2 * BUFFER_ROW_COUNT * DEFAULT_ROW_HEIGHT;

export function setViewportRendering(state, value) {
    state.enableViewportRendering = normalizeBoolean(value);
}

export function isViewportRenderingEnabled(state) {
    return state.enableViewportRendering;
}

/**
 * @typedef RenderManagerConfig
 * @type {object}
 * @property {boolean} viewportRendering - specifies whether to use viewport rendering
 * @property {number} rowHeight - specifies the height of a row, in px
 */

/**
 * Updates and normalizes the configuration for this RenderManager
 *
 * @param {LightningDatatable} dt
 * @param {RenderManager} renderManager
 * @param {RenderManagerConfig} config
 *
 * @returns {RenderManager}
 */
function normalizeAndProcessConfig(dt, renderManager, config) {
    const { viewportRendering, rowHeight } = config;

    if (viewportRendering && typeof viewportRendering === 'boolean') {
        renderManager.initializeResizeObserver(dt);
    }

    if (typeof rowHeight === 'number') {
        renderManager.rowHeight = rowHeight;
        renderManager.threshold = calculateThreshold(rowHeight);
    }

    return renderManager;
}

function calculateThreshold(rowHeight) {
    return 2 * BUFFER_ROW_COUNT * rowHeight;
}

function getDefaultPreviousInfo() {
    return {
        renderedRowCount: 0,
        totalRowCount: 0,
        firstRowKey: '',
    };
}

/**
 * Handles any custom rendering in datatable.
 *
 * Currently only supports viewport rendering, which renders only the number of rows
 * that can be shown in the table viewport. Provides a stepping stone towards
 * full virtual rendering
 */
export class RenderManager {
    constructor() {
        this.rowHeight = DEFAULT_ROW_HEIGHT;
        this.threshold = DEFAULT_SCROLL_THRESHOLD;
        this.wrapperHeight = 0;
        this.previousCache = getDefaultPreviousInfo();
    }

    /**
     *
     * @param {LightningDatatable} dt
     * @param {RenderManagerConfig} config
     */
    configure(dt, config) {
        normalizeAndProcessConfig(dt, this, config);
    }

    /**
     * Initializes a resize observer to update the wrapper height
     * when the datatable component's height changes
     *
     * @param {LightningDatatable} dt
     */
    initializeResizeObserver(dt) {
        if (!this._heightResizeObserver) {
            this._heightResizeObserver = new LightningResizeObserver(() => {
                if (this._resizeObserverConnected) {
                    this.updateWrapperHeight(dt);

                    // If the wrapper is now larger than the table, we need to update
                    // the rendered rows so users can continue scrolling
                    const rowCountWithBuffer = this.getRowCountWithBuffer();
                    if (rowCountWithBuffer > dt._renderedRowCount) {
                        this.updateRenderedRows(dt, rowCountWithBuffer);
                    }
                }
            });
        }
    }

    /**
     * Connect the resize observer to the correct element
     *
     * @param {LightningDatatable} dt
     */
    connectResizeObserver(dt) {
        if (this._heightResizeObserver) {
            const resizeTarget = dt.template.querySelector(
                'div.dt-outer-container'
            );
            this._heightResizeObserver.observe(resizeTarget);
            this._resizeObserverConnected = true;
        }
    }

    /**
     * Disconnect the resize observer
     */
    disconnectResizeObserver() {
        if (this._heightResizeObserver) {
            this._resizeObserverConnected = false;
            this._heightResizeObserver.disconnect();
        }
    }

    hasWrapperHeight() {
        return !!this.wrapperHeight;
    }

    /**
     * Caches the height of the wrapper in Datatable to avoid
     * unnecessary reflows
     *
     * @param {LightningDatatable} dt
     */
    updateWrapperHeight(dt) {
        this.wrapperHeight =
            dt.template.querySelector('.slds-scrollable_x').offsetHeight;
    }

    /**
     * Calculates how many rows fits within the current wrapper
     */
    getRowCountInViewport() {
        return Math.floor(this.wrapperHeight / this.rowHeight);
    }

    getRowCountWithBuffer() {
        return this.getRowCountInViewport() + BUFFER_ROW_COUNT;
    }

    /**
     * Render only rows that fit within the viewport
     *
     * If data has changed (verifying only row 1), reset everything
     * Otherwise, if total row count has increased and we are within the scroll threshold,
     * append a viewport's worth of rows to the currently rendered rows. This happens when
     * the user has added more data to the datatable (e.g when a loadMore is triggered)
     *
     * @param {LightningDatatable} dt
     */
    updateViewportRendering(dt, forceUpdate) {
        if (this.hasDataChanged(dt) || forceUpdate) {
            this.updateRenderedRows(dt, this.getRowCountWithBuffer());
        } else if (
            this.previousCache.totalRowCount < dt.state.rows.length &&
            this.isWithinThreshold(dt.template.querySelector('table'))
        ) {
            this.updateRenderedRows(
                dt,
                this.previousCache.renderedRowCount +
                    this.getRowCountWithBuffer()
            );
        } else {
            this.updateRenderedRows(dt, this.previousCache.renderedRowCount);
        }
    }

    /**
     * If the scroll is within a specified threshold of the bottom,
     * calculate and render the next batch of rows
     *
     * @param {LightningDatatable} dt
     * @param {Event} event - scroll event
     */
    handleScroll(dt, event) {
        const currentLength = dt._renderedRowCount;
        if (
            this.isWithinThreshold(event.target.firstChild) &&
            currentLength < dt.state.rows.length
        ) {
            this.updateRenderedRows(
                dt,
                currentLength + this.getRowCountWithBuffer()
            );
        }
    }

    updateRenderedRows(dt, rowCount) {
        const totalRows = dt.state.rows.length;
        const normalizedRowCount = rowCount
            ? Math.min(rowCount, totalRows)
            : totalRows;
        dt._renderedRowCount = normalizedRowCount;

        // Update our internal cache
        this.previousCache.renderedRowCount = normalizedRowCount;
        this.previousCache.totalRowCount = totalRows;

        if (dt.state.rows.length > 0) {
            this.previousCache.firstRowKey = dt.state.rows[0].key;
        }
    }

    isWithinThreshold(target) {
        const offset = getScrollOffsetFromTableEnd(target);
        return offset < this.threshold;
    }

    hasDataChanged(dt) {
        return (
            dt.state.rows.length > 0 &&
            this.previousCache.firstRowKey !== dt.state.rows[0].key
        );
    }
}
