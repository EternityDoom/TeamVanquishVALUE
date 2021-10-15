import labelButtonAlternativeText from '@salesforce/label/LightningHelptext.buttonAlternativeText';
import { LightningElement, api, track } from 'lwc';
import { isValidName } from 'lightning/iconUtils';
import { normalizeString } from 'lightning/utilsPrivate';
import { classSet } from 'lightning/utils';
import { Tooltip, TooltipType } from 'lightning/tooltipLibrary';

const DEFAULT_BUTTON_ALT_TEXT = labelButtonAlternativeText;
const DEFAULT_ICON_NAME = 'utility:info';
const DEFAULT_ICON_VARIANT = 'bare';

/**
 * An icon with a text popover used for tooltips.
 */
export default class LightningHelptext extends LightningElement {
    // TODO: future refactoring to remove this.state convention
    @track
    state = {
        iconName: DEFAULT_ICON_NAME,
        iconVariant: DEFAULT_ICON_VARIANT,
        alternativeText: DEFAULT_BUTTON_ALT_TEXT,
    };

    /**
     * Text to be shown in the popover.
     * @type {string}
     * @param {string} value - The plain text string for the tooltip
     */
    @api
    get content() {
        return this._tooltip ? this._tooltip.value : undefined;
    }

    set content(value) {
        if (this._tooltip) {
            this._tooltip.value = value;
        } else if (value) {
            // Note that because the tooltip target is a child element it may not be present in the
            // dom during initial rendering.
            this._tooltip = new Tooltip(value, {
                root: this,
                target: () => this.template.querySelector('button'),
                type: TooltipType.Toggle,
            });
            this._tooltip.initialize();
        }
    }

    set iconName(value) {
        this.state.iconName = value;
    }

    /**
     * The Lightning Design System name of the icon used as the visible element.
     * Names are written in the format 'utility:info' where 'utility' is the category,
     * and 'info' is the specific icon to be displayed.
     * The default is 'utility:info'.
     * @type {string}
     * @param {string} value the icon name to use
     * @default utility:info
     */
    @api
    get iconName() {
        if (isValidName(this.state.iconName)) {
            return this.state.iconName;
        }

        return DEFAULT_ICON_NAME;
    }

    set iconVariant(value) {
        this.state.iconVariant = value;
    }

    /**
     * Changes the appearance of the icon.
     * Accepted variants include inverse, warning, error.
     * @type {string}
     * @param {string} value the icon variant to use
     * @default bare
     */
    @api
    get iconVariant() {
        // NOTE: Leaving a note here because I just wasted a bunch of time
        // investigating why both 'bare' and 'inverse' are supported in
        // lightning-primitive-icon. lightning-icon also has a deprecated
        // 'bare', but that one is synonymous to 'inverse'. This 'bare' means
        // that no classes should be applied. So this component needs to
        // support both 'bare' and 'inverse' while lightning-icon only needs to
        // support 'inverse'.
        return normalizeString(this.state.iconVariant, {
            fallbackValue: DEFAULT_ICON_VARIANT,
            validValues: ['bare', 'error', 'inverse', 'warning'],
        });
    }

    /**
     * The assistive text for the button icon. The default is "Help".
     * Screen readers announce the assistive text and help text content as {alternativeText} button {content}.
     * If not set, screen readers announce "Help button {content}".
     * The text should describe the function of the icon, for example, "Show help text".
     *
     * @type {string}
     * @param {string} value The assistive text to set
     * @default Help
     */
    @api
    get alternativeText() {
        return this.state.alternativeText;
    }

    set alternativeText(value) {
        // typeof 'string' check prevents <lightning-helptext alternative-text>
        //   from setting 'true' as the a11y help text
        // lwc treats above alternative-text as: true (typeof 'boolean')
        //   we want to prevent 'true' or empty string as a11y text, instead default to 'Help'
        if (value && typeof value === 'string' && value.trim() !== '') {
            this.state.alternativeText = value;
        } else {
            // warn why they can't unset the value
            // eslint-disable-next-line no-console
            console.warn(
                `<lightning-helptext> Invalid alternativeText value: ${value}`
            );
        }
    }

    _tooltip = null;

    disconnectedCallback() {
        // W-6441609 helptext maybe destroyed first, and tooltip won't receive events to hide.
        if (this._tooltip && !this._tooltip.initialized) {
            this._tooltip.hide();
        }
        this._tooltip = null;
    }

    renderedCallback() {
        if (this._tooltip && !this._tooltip.initialized) {
            this._tooltip.initialize();
        }
    }

    // Get the classes to be applied to button based on the icon variant
    get computedButtonClass() {
        const classes = classSet('slds-button slds-button_icon');
        switch (this.iconVariant) {
            case 'error':
                classes.add('slds-button_icon-error');
                break;
            case 'warning':
                classes.add('slds-button_icon-warning');
                break;
            case 'inverse':
                classes.add('slds-button_icon-inverse');
                break;
            case 'bare':
                break;
            default:
        }
        return classes.toString();
    }
}
