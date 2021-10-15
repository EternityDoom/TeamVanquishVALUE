import { LightningElement, api } from 'lwc';
import {
    classListMutation,
    normalizeString,
    isIE11,
} from 'lightning/utilsPrivate';
import {
    computeSldsClass,
    getCategory,
    isValidName,
} from 'lightning/iconUtils';

import { normalizeVariant } from './util';

/**
 * Represents a visual element that provides context and enhances usability.
 */
export default class LightningIcon extends LightningElement {
    _src;
    privateIconName;
    _iconName;
    _size;
    _variant;

    /**
     * The alternative text used to describe the icon.
     * This text should describe what happens when you click the button,
     * for example 'Upload File', not what the icon looks like, 'Paperclip'.
     * @type {string}
     */
    @api alternativeText;

    /**
     * A uri path to a custom svg sprite, including the name of the resouce,
     * for example: /assets/icons/standard-sprite/svg/test.svg#icon-heart
     * @type {string}
     */
    @api
    get src() {
        return this.privateSrc;
    }
    set src(value) {
        this.privateSrc = value;

        // if value is not present, then we set the state back
        // to the original iconName that was passed
        // this might happen if the user sets a custom icon, then
        // decides to revert back to SLDS by removing the src attribute
        if (!value) {
            this._iconName = this.iconName;
            this.classList.remove('slds-icon-standard-default');
        }

        // if isIE11 and the src is set
        // we'd like to show the 'standard:default' icon instead
        // for performance reasons.
        if (value && isIE11) {
            this.setDefault();
            return;
        }

        this._src = value;
    }

    /**
     * The Lightning Design System name of the icon.
     * Names are written in the format 'utility:down' where 'utility' is the category,
     * and 'down' is the specific icon to be displayed.
     * @type {string}
     * @required
     */
    @api
    get iconName() {
        return this.privateIconName;
    }
    set iconName(value) {
        this.privateIconName = value;

        // if src is set, we don't need to validate
        // iconName
        if (this.src) {
            return;
        }

        if (isValidName(value)) {
            const isAction = getCategory(value) === 'action';

            // update classlist only if new iconName is different than _iconName
            // otherwise classListMutation receives class:true and class: false and removes slds class
            if (value !== this._iconName) {
                classListMutation(this.classList, {
                    'slds-icon_container_circle': isAction,
                    [computeSldsClass(value)]: true,
                    [computeSldsClass(this._iconName)]: false,
                });
            }
            this._iconName = value;
        } else {
            console.warn(`<lightning-icon> Invalid icon name ${value}`); // eslint-disable-line no-console

            // Invalid icon names should render a blank icon. Remove any
            // classes that might have been previously added.
            classListMutation(this.classList, {
                'slds-icon_container_circle': false,
                [computeSldsClass(this._iconName)]: false,
            });

            this._iconName = undefined;
        }
    }

    /**
     * The size of the icon. Options include xx-small, x-small, small, medium, or large.
     * The default is medium.
     * @type {string}
     * @default medium
     */
    @api
    get size() {
        return normalizeString(this._size, {
            fallbackValue: 'medium',
            validValues: ['xx-small', 'x-small', 'small', 'medium', 'large'],
        });
    }
    set size(value) {
        this._size = value;
    }

    /**
     * The variant changes the appearance of a utility icon.
     * Accepted variants include inverse, success, warning, and error.
     * Use the inverse variant to implement a white fill in utility icons on dark backgrounds.
     * @type {string}
     */
    @api
    get variant() {
        return normalizeVariant(this._variant, this._iconName);
    }
    set variant(value) {
        this._variant = value;
    }

    connectedCallback() {
        this.classList.add('slds-icon_container');
    }

    setDefault() {
        this._src = undefined;
        this._iconName = 'standard:default';
        this.classList.add('slds-icon-standard-default');
    }
}
