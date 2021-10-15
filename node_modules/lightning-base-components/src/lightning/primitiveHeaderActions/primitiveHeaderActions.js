import labelClipText from '@salesforce/label/LightningDatatable.clipText';
import labelShowActions from '@salesforce/label/LightningDatatable.showActions';
import labelWrapText from '@salesforce/label/LightningDatatable.wrapText';
import { LightningElement, api, track } from 'lwc';
import { deepCopy } from 'lightning/utilsPrivate';

const i18n = {
    clipText: labelClipText,
    showActions: labelShowActions,
    wrapText: labelWrapText,
};

export default class PrimitiveHeaderActions extends LightningElement {
    static delegatesFocus = true;
    @api colKeyValue;

    @track containerRect;
    @track _internalActions = [];
    @track _customerActions = [];
    _actionMenuAlignment;

    @api
    focus() {
        const btnMenu = this.template.querySelector('lightning-button-menu');

        if (btnMenu) {
            btnMenu.focus();
        }
    }

    @api
    get actions() {
        return this._actions;
    }

    set actions(value) {
        this._actions = value;
        this.updateActions();
    }

    get i18n() {
        return i18n;
    }

    updateActions() {
        const actionTypeReducer = (type) => (actions, action) => {
            const overrides = { _type: type, _action: action };
            actions.push(Object.assign({}, action, overrides));

            return actions;
        };

        this._internalActions = this.getActionsByType('internalActions').reduce(
            actionTypeReducer('internal'),
            []
        );

        this._customerActions = this.getActionsByType('customerActions').reduce(
            actionTypeReducer('customer'),
            []
        );

        // ToDo: W-8389508 Refactor so menu is outside of header
        this._actionMenuAlignment =
            this._actions.menuAlignment &&
            this._actions.menuAlignment.replace('auto-', '');
    }

    get hasActions() {
        return (
            this._internalActions.length > 0 || this._customerActions.length > 0
        );
    }
    get hasActionsDivider() {
        return (
            this._internalActions.length > 0 && this._customerActions.length > 0
        );
    }

    getActionsByType(type) {
        return Array.isArray(this._actions[type]) ? this._actions[type] : [];
    }

    handleMenuOpen(event) {
        event.preventDefault();
        event.stopPropagation();

        this.elementRect = this.template
            .querySelector('lightning-button-menu')
            .getBoundingClientRect();

        this.dispatchEvent(
            new CustomEvent('privatecellheaderactionmenuopening', {
                bubbles: true,
                composed: true,
                cancelable: true,
                detail: {
                    actionsCount:
                        this._internalActions.length +
                        this._customerActions.length,
                    dividersCount: this.hasActionsDivider ? 1 : 0,
                    saveContainerPosition: (containerRect) => {
                        this.containerRect = containerRect;
                    },
                },
            })
        );
    }

    handleMenuClose() {
        this.dispatchEvent(
            new CustomEvent('privatecellheaderactionmenuclosed', {
                bubbles: true,
                composed: true,
                cancelable: true,
            })
        );
    }

    handleActionSelect(evt) {
        const action = evt.detail.value;

        this.dispatchEvent(
            new CustomEvent('privatecellheaderactiontriggered', {
                composed: true,
                bubbles: true,
                cancelable: true,
                detail: {
                    action: deepCopy(action._action),
                    actionType: action._type,
                    colKeyValue: this.colKeyValue,
                },
            })
        );
    }
}
