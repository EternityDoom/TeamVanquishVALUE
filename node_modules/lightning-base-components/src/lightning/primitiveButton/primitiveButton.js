import { LightningElement, api, track } from 'lwc';
import {
    isIE11,
    normalizeBoolean,
    normalizeString,
    synchronizeAttrs,
    buttonGroupOrderClass,
} from 'lightning/utilsPrivate';
import { classSet } from 'lightning/utils';

const ARIA_DESCRIBEDBY = 'aria-describedby';
const ARIA_CONTROLS = 'aria-controls';
const ARIA_LABELLEDBY = 'aria-labelledby';

/**
 * Primitive for button, buttonIcon and buttonIconStateful
 */
export default class LightningPrimitiveButton extends LightningElement {
    _initialized = false;

    @track
    state = {
        accesskey: null,
        ariaAtomic: null,
        ariaControls: null,
        ariaDescribedBy: null,
        ariaLabelledBy: null,
        ariaExpanded: null,
        ariaHasPopup: null,
        ariaLabel: null,
        ariaLive: null,
        disabled: false,
    };

    /**
     * Specifies whether this button should be displayed in a disabled state.
     * Disabled buttons can't be clicked. This value defaults to false.
     *
     * @type {boolean}
     * @default false
     */
    @api
    get disabled() {
        return this.state.disabled;
    }

    set disabled(value) {
        this.state.disabled = normalizeBoolean(value);
    }

    set accessKey(value) {
        this.state.accesskey = value;
    }

    /**
     * Specifies a shortcut key to activate or focus an element.
     *
     * @type {string}
     */
    @api
    get accessKey() {
        return this.state.accesskey;
    }

    get computedAccessKey() {
        return this.state.accesskey;
    }

    /**
     * Displays tooltip text when the mouse cursor moves over the element.
     *
     * @type {string}
     */
    @api
    get title() {
        return this.state.title;
    }

    set title(value) {
        this.state.title = value;
    }

    /**
     * Label describing the button to assistive technologies.
     *
     * @type {string}
     */
    @api
    get ariaLabel() {
        return this.state.ariaLabel;
    }

    set ariaLabel(value) {
        this.state.ariaLabel = value;
    }

    get computedAriaLabel() {
        return this.state.ariaLabel;
    }

    /**
     * Specifies the ID or list of IDs of the element or elements that
     * contain visible descriptive text to describe the button.
     */
    @api
    get ariaLabelledBy() {
        return this.state.ariaLabelledBy;
    }

    set ariaLabelledBy(value) {
        this.state.ariaLabelledBy = value;
        const button = this.template.querySelector('button');
        synchronizeAttrs(button, {
            [ARIA_LABELLEDBY]: value,
        });
    }

    get computedAriaLabelledBy() {
        return this.state.ariaLabelledBy;
    }

    /**
     * A space-separated list of element IDs that provide descriptive labels for the button.
     *
     * @type {string}
     */
    @api
    get ariaDescribedBy() {
        return this.state.ariaDescribedBy;
    }

    set ariaDescribedBy(value) {
        this.state.ariaDescribedBy = value;
        const button = this.template.querySelector('button');
        synchronizeAttrs(button, {
            [ARIA_DESCRIBEDBY]: value,
        });
    }

    /**
     * A space-separated list of element IDs whose presence or content is controlled by this button.
     *
     * @type {string}
     */
    @api
    get ariaControls() {
        return this.state.ariaControls;
    }

    set ariaControls(value) {
        this.state.ariaControls = value;
        const button = this.template.querySelector('button');
        synchronizeAttrs(button, {
            [ARIA_CONTROLS]: value,
        });
    }

    /**
     * Indicates whether an element that the button controls is expanded or collapsed.
     * Valid values are 'true' or 'false'. The default value is undefined.
     *
     * @type {string}
     * @default undefined
     */
    @api
    get ariaExpanded() {
        return this.state.ariaExpanded;
    }

    set ariaExpanded(value) {
        this.state.ariaExpanded = normalizeString(value, {
            fallbackValue: undefined,
            validValues: ['true', 'false'],
        });
    }

    get computedAriaExpanded() {
        return this.state.ariaExpanded || null;
    }

    set ariaLive(value) {
        this.state.ariaLive = value;
    }
    /**
     * Indicates that the button has an interactive popup element.
     * Valid values are 'true', 'dialog', 'menu', 'listbox', 'tree', and 'grid' based on ARIA 1.1 specifications.
     * The default value is undefined.
     *
     * @type {string}
     * @default undefined
     */
    @api
    get ariaHasPopup() {
        return this.state.ariaHasPopup;
    }

    set ariaHasPopup(value) {
        this.state.ariaHasPopup = normalizeString(value, {
            fallbackValue: undefined,
            validValues: ['true', 'dialog', 'menu', 'listbox', 'tree', 'grid'],
        });
    }

    get computedAriaHasPopup() {
        return this.state.ariaHasPopup || null;
    }
    /**
     * Indicates that the button can be updated when it doesn't have focus.
     * Valid values are 'polite', 'assertive', or 'off'. The polite value causes assistive
     * technologies to notify users of updates at a low priority, generally without interrupting.
     * The assertive value causes assistive technologies to notify users immediately,
     * potentially clearing queued speech updates.
     *
     * @type {string}
     */
    @api
    get ariaLive() {
        return this.state.ariaLive;
    }

    get computedAriaLive() {
        return this.state.ariaLive;
    }

    /**
     * Indicates whether assistive technologies present all, or only parts of,
     * the changed region. Valid values are 'true' or 'false'.
     *
     * @type {string}
     */
    @api
    get ariaAtomic() {
        return this.state.ariaAtomic || null;
    }

    set ariaAtomic(value) {
        this.state.ariaAtomic = normalizeString(value, {
            fallbackValue: undefined,
            validValues: ['true', 'false'],
        });
    }

    get computedAriaAtomic() {
        return this.state.ariaAtomic || null;
    }

    /**
     * Sets focus on the element.
     */
    @api
    focus() {}

    /**
     * Reserved for internal use only.
     * Describes the order of this element (first, middle or last) inside lightning-button-group.
     * @type {string}
     */
    @api groupOrder = '';

    constructor() {
        super();

        // Workaround for an IE11 bug where click handlers on button ancestors
        // receive the click event even if the button element has the `disabled`
        // attribute set.
        if (isIE11) {
            this.template.addEventListener('click', (event) => {
                if (this.disabled) {
                    event.stopImmediatePropagation();
                }
            });
        }
    }

    renderedCallback() {
        if (!this._initialized) {
            const button = this.template.querySelector('button');
            synchronizeAttrs(button, {
                [ARIA_CONTROLS]: this.state.ariaControls,
                [ARIA_DESCRIBEDBY]: this.state.ariaDescribedBy,
                [ARIA_LABELLEDBY]: this.state.ariaLabelledBy,
            });
            this._initialized = true;
        }
    }

    get computedButtonClass() {
        const classes = classSet('slds-button');
        classes.add(buttonGroupOrderClass(this.groupOrder));
        return classes.toString();
    }
}
