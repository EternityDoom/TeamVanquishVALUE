import labelLoadingActions from '@salesforce/label/LightningPrimitiveCellActions.loadingActions';
import labelShowActions from '@salesforce/label/LightningPrimitiveCellActions.showActions';
import { LightningElement, api, track } from 'lwc';
import { normalizeString } from 'lightning/utilsPrivate';

const DEFAULT_MENU_ALIGNMENT = 'auto-right';
const VALID_MENU_ALIGNMENT = [
    'auto-right',
    'auto-left',
    'auto',
    'left',
    'center',
    'right',
    'bottom-left',
    'bottom-center',
    'bottom-right',
];

const i18n = {
    loadingActions: labelLoadingActions,
    showActions: labelShowActions,
};

export default class PrimitiveCellActions extends LightningElement {
    static delegatesFocus = true;

    @api rowKeyValue;
    @api colKeyValue;
    @api rowActions;

    @track containerRect;
    @track _actions = [];

    _isLoadingActions;
    _menuAlignment = DEFAULT_MENU_ALIGNMENT;
    _internalTabIndex = false;

    connectedCallback() {
        this._connected = true;
    }

    disconnectedCallback() {
        this._connected = false;
    }

    @api
    get menuAlignment() {
        return this._menuAlignment;
    }

    set menuAlignment(value) {
        this._menuAlignment = normalizeString(value, {
            fallbackValue: DEFAULT_MENU_ALIGNMENT,
            validValues: VALID_MENU_ALIGNMENT,
        });
    }

    @api
    focus() {
        if (this._connected) {
            this.template.querySelector('lightning-button-menu').focus();
        }
    }

    @api
    click() {
        if (this._connected) {
            // focus/click without changing tabindex doesnt work W-6185168
            // eslint-disable-next-line @lwc/lwc/no-async-operation
            setTimeout(() => {
                this.template.querySelector('lightning-button-menu').click();
            }, 0);
        }
    }

    get computedMenuAlignment() {
        return this.menuAlignment;
    }

    get buttonAlternateText() {
        return `${i18n.showActions}`;
    }

    get spinnerAlternateText() {
        return `${i18n.loadingActions}`;
    }

    handleActionSelect(event) {
        this.dispatchEvent(
            new CustomEvent('privatecellactiontriggered', {
                composed: true,
                bubbles: true,
                cancelable: true,
                detail: {
                    rowKeyValue: this.rowKeyValue,
                    colKeyValue: this.colKeyValue,
                    action: event.detail.value,
                },
            })
        );
    }

    handleMenuOpen() {
        this.elementRect = this.template
            .querySelector('lightning-button-menu')
            .getBoundingClientRect();

        const detail = {
            rowKeyValue: this.rowKeyValue,
            colKeyValue: this.colKeyValue,
            doneCallback: this.finishLoadingActions.bind(this),
            saveContainerPosition: (containerRect) => {
                this.containerRect = containerRect;
            },
        };

        if (typeof this.rowActions === 'function') {
            this._isLoadingActions = true;
            this._actions = [];

            detail.actionsProviderFunction = this.rowActions;
            // This callback should always be async
            Promise.resolve().then(() => {
                this.dispatchEvent(
                    new CustomEvent('privatecellactionmenuopening', {
                        composed: true,
                        bubbles: true,
                        cancelable: true,
                        detail,
                    })
                );
            });
        } else {
            this._actions = this.rowActions;
        }
    }

    finishLoadingActions(actions) {
        this._isLoadingActions = false;
        this._actions = actions;
    }
}
