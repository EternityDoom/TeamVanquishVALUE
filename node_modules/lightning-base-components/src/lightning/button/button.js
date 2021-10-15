import { api, track } from 'lwc';
import { classSet } from 'lightning/utils';
import { normalizeString as normalize } from 'lightning/utilsPrivate';
import LightningPrimitiveButton from 'lightning/primitiveButton';
import template from './button.html';

/**
 * A clickable element used to perform an action.
 */
export default class LightningButton extends LightningPrimitiveButton {
    static delegatesFocus = true;

    /**
     * The name for the button element.
     * This value is optional and can be used to identify the button in a callback.
     *
     * @type {string}
     */
    @api name;

    /**
     * The value for the button element.
     * This value is optional and can be used when submitting a form.
     *
     * @type {string}
     */
    @api value;

    /**
     * The text to be displayed inside the button.
     *
     * @type {string}
     */
    @api label;

    /**
     * The variant changes the appearance of the button.
     * Accepted variants include base, neutral, brand, brand-outline, destructive, destructive-text, inverse, and success.
     * This value defaults to neutral.
     *
     * @type {string}
     * @default neutral
     */
    @api variant = 'neutral';

    /**
     * The Lightning Design System name of the icon.
     * Names are written in the format 'utility:down' where 'utility' is the category,
     * and 'down' is the specific icon to be displayed.
     *
     * @type {string}
     */
    @api iconName;

    /**
     * Describes the position of the icon with respect to the button label.
     * Options include left and right.
     * This value defaults to left.
     *
     * @type {string}
     * @default left
     */
    @api iconPosition = 'left';

    /**
     * Specifies the type of button.
     * Valid values are button, reset, and submit.
     * This value defaults to button.
     *
     * @type {string}
     * @default button
     */
    @api type = 'button';

    /**
     * Reserved for internal use. If present, disables button animation.
     */
    @api disableAnimation;

    @track title = null;

    render() {
        return template;
    }

    get computedButtonClass() {
        const classes = classSet(super.computedButtonClass);
        return classes
            .add({
                'slds-button_neutral': this.normalizedVariant === 'neutral',
                'slds-button_brand': this.normalizedVariant === 'brand',
                'slds-button_outline-brand':
                    this.normalizedVariant === 'brand-outline',
                'slds-button_destructive':
                    this.normalizedVariant === 'destructive',
                'slds-button_text-destructive':
                    this.normalizedVariant === 'destructive-text',
                'slds-button_inverse': this.normalizedVariant === 'inverse',
                'slds-button_success': this.normalizedVariant === 'success',
            })
            .toString();
    }

    get computedTitle() {
        return this.title;
    }

    get normalizedVariant() {
        return normalize(this.variant, {
            fallbackValue: 'neutral',
            validValues: [
                'base',
                'neutral',
                'brand',
                'brand-outline',
                'destructive',
                'destructive-text',
                'inverse',
                'success',
            ],
        });
    }

    get normalizedType() {
        return normalize(this.type, {
            fallbackValue: 'button',
            validValues: ['button', 'reset', 'submit'],
        });
    }

    get normalizedIconPosition() {
        return normalize(this.iconPosition, {
            fallbackValue: 'left',
            validValues: ['left', 'right'],
        });
    }

    get showIconLeft() {
        return this.iconName && this.normalizedIconPosition === 'left';
    }

    get showIconRight() {
        return this.iconName && this.normalizedIconPosition === 'right';
    }

    get computedIconClass() {
        return classSet('slds-button__icon')
            .add({
                'slds-button__icon_left':
                    this.normalizedIconPosition === 'left',
                'slds-button__icon_right':
                    this.normalizedIconPosition === 'right',
            })
            .toString();
    }

    handleButtonFocus() {
        this.dispatchEvent(new CustomEvent('focus'));
    }

    handleButtonBlur() {
        this.dispatchEvent(new CustomEvent('blur'));
    }

    /**
     * Sets focus on the button.
     */
    @api
    focus() {
        if (this._connected) {
            this.button.focus();
        }
    }

    /**
     * Simulates a mouse click on the button.
     */
    @api
    click() {
        if (this._connected) {
            this.button.click();
        }
    }

    /**
     * Once we are connected, we fire a register event so the button-group (or other) component can register
     * the buttons.
     */
    connectedCallback() {
        this._connected = true;
    }

    get button() {
        return this.template.querySelector('button');
    }

    renderedCallback() {
        // initialize aria attributes in primitiveButton
        super.renderedCallback();
        // button is inherit from primitiveButton, button.css not working in this case.
        // change host style to disable pointer event.
        this.template.host.style.pointerEvents = this.disabled ? 'none' : '';
    }

    disconnectedCallback() {
        this._connected = false;
    }
}

LightningButton.interopMap = {
    exposeNativeEvent: {
        click: true,
        focus: true,
        blur: true,
    },
};
