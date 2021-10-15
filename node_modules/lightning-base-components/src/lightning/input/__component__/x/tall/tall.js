import { LightningElement } from 'lwc';

export default class Tall extends LightningElement {
    sendFocusToTop() {
        this.template.querySelector('lightning-input').focus();
    }
}
