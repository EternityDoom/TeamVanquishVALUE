import { LightningElement, api } from 'lwc';

/**
 * Creates a subheader in the list of items in lightning-button-menu.
 */
export default class LightningMenuSubheader extends LightningElement {
    /**
     * The text displayed in the subheader.
     * @type {string}
     */
    @api label;

    connectedCallback() {
        // add default CSS classes to custom element tag
        this.classList.add('slds-dropdown__header');
        this.classList.add('slds-truncate');

        this.setAttribute('role', 'separator');
    }
}
