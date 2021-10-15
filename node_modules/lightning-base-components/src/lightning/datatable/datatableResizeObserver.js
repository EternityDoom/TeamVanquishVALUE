import { LightningResizeObserver } from 'lightning/resizeObserver';
import { isTableRenderedVisible } from './resizer';
import { ResizeSensor } from './resizeSensor';
import { debounce } from 'lightning/inputUtils';
import { getColumns } from './columns-shared';

const WIDTH_OBSERVER_SELECTOR = '.dt-width-observer';

function createResizeSensor(
    dtObserver,
    columnWidthManager,
    template,
    state,
    widthsData,
    resizeTarget
) {
    return new ResizeSensor(
        resizeTarget,
        debounce(() => {
            // since this event handler is debounced, it might be the case that at the time the handler is called,
            // the element is disconnected (this.hasDetachedListeners)
            // the scroll event which the ResizeSensor uses can happen when table is hidden (as in console when switching tabs)
            // and hence the need for isTableRenderedVisible check
            if (dtObserver.isConnected() && isTableRenderedVisible(template)) {
                columnWidthManager.adjustColumnsSizeAfterResize(
                    template,
                    getColumns(state),
                    widthsData
                );
            }
        }, 200)
    );
}

export class LightningDatatableResizeObserver {
    _connected = false;
    _resizeObserverAvailable = typeof ResizeObserver === 'function';

    constructor(template, state, widthsData, columnWidthManager) {
        const resizeTarget = template.querySelector(WIDTH_OBSERVER_SELECTOR);

        if (this._resizeObserverAvailable) {
            this._resizeObserver = new LightningResizeObserver(() => {
                if (this._connected && isTableRenderedVisible(template)) {
                    columnWidthManager.adjustColumnsSizeAfterResize(
                        template,
                        getColumns(state),
                        widthsData
                    );
                }
            });
            this._resizeObserver.observe(resizeTarget);
        } else {
            // fallback behavior for IE11 and Safari using existing resize sensor functionality (less performant)
            this._resizeSensor = createResizeSensor(
                this,
                columnWidthManager,
                template,
                state,
                widthsData,
                resizeTarget
            );
        }

        this._connected = true;
    }

    observe(template) {
        const targetElement = template.querySelector(WIDTH_OBSERVER_SELECTOR);

        if (this._resizeObserver) {
            this._resizeObserver.observe(targetElement);
        } else if (this._resizeSensor) {
            this._resizeSensor.reattach(targetElement);
        }

        this._connected = true;
    }

    disconnect() {
        if (this._resizeObserver) {
            this._resizeObserver.disconnect();
        } else if (this._resizeSensor) {
            this._resizeSensor.detach();
            this._resizeSensor = undefined;
        }

        this._connected = false;
    }

    isConnected() {
        return this._connected;
    }
}
