import { LightningElement, api, track } from 'lwc';
import { guid } from 'lightning/utilsPrivate';

export default class LightningVerticalNavigationSection extends LightningElement {
    headingId = guid();

    @track _label;

    /**
     * The heading text for this section.
     * @param {String} label - The heading text for this section.
     */
    set label(label) {
        this._label = label;
    }

    /**
     * The heading text for this section.
     * @returns {String} The heading text for this section.
     */
    @api
    get label() {
        return this._label || '';
    }

    handleOverflowRegister(event) {
        event.stopPropagation(); // suppressing event since it's a private event and not part of public API
        const item = event.detail;
        item.callbacks.updateAssistiveText(this.label);
    }
}
