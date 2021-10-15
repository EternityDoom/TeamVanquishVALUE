import { LightningElement, api, track } from 'lwc';
import {
    normalizeBoolean,
    parseToFormattedLinkifiedParts,
    parseToFormattedParts,
} from 'lightning/utilsPrivate';

/**
 * Displays text, replaces newlines with line breaks, and linkifies if requested.
 */
export default class FormattedText extends LightningElement {
    /**
     * Sets the text to display.
     * @type {string}
     *
     */
    @api value = '';

    @track _linkify = false;

    /**
     * If present, URLs and email addresses are displayed in anchor tags.
     * They are displayed in plain text by default.
     * @type {boolean}
     * @default false
     */
    @api
    get linkify() {
        return this._linkify;
    }
    set linkify(value) {
        this._linkify = normalizeBoolean(value);
    }

    get formattedParts() {
        if (!this.value || typeof this.value !== 'string') {
            return [];
        }
        return this.linkify
            ? parseToFormattedLinkifiedParts(this.value)
            : parseToFormattedParts(this.value);
    }
}
