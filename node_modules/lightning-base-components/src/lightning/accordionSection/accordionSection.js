import { LightningElement, api, track } from 'lwc';
import { classSet } from 'lightning/utils';
import { generateUniqueId } from 'lightning/inputUtils';
import { keyCodes } from 'lightning/utilsPrivate';

/**
 * A single section that is nested in an accordion component.
 * @slot actions Placeholder for actionable components, such as lightning-button or lightning-button-menu.
 * Actions are displayed at the top right corner of the accordion section.
 * @slot default Placeholder for your content in the accordion section.
 */
export default class LightningAccordionSection extends LightningElement {
    /**
     * The unique section name to use with the active-section-name attribute in the accordion component.
     * @type {string}
     */
    @api name;

    /**
     * The text that displays as the title of the section.
     * @type {string}
     */
    @api label;

    /**
     * Reserved for internal use.
     * @type {string}
     */
    @api title;

    @track privateIsOpen = false;

    /**
     * Section should have received focus, but hasn't yet.
     */
    pendingFocus = false;

    privateUniqueId = generateUniqueId('lgt-accordion-section');

    connectedCallback() {
        this.setAttribute('role', 'listitem');
        this.classList.add('slds-accordion__list-item');
        this.registerSectionWithParent();
    }

    disconnectedCallback() {
        this.privateAccordionSectionObserver.notifySectionDeregister();
    }

    renderedCallback() {
        // After the classes are applied the section button might be outside viewport, we apply focus again to bring it back.
        if (this.privateIsOpen && this.pendingFocus) {
            this.pendingFocus = false;
            this.focusSection();
        }
    }

    get computedAriaExpanded() {
        return this.privateIsOpen.toString();
    }

    get computedAriaHidden() {
        return (!this.privateIsOpen).toString();
    }

    get computedSectionClasses() {
        return classSet('slds-accordion__section')
            .add({
                'slds-is-open': this.privateIsOpen,
            })
            .toString();
    }

    get computedHidden() {
        return this.privateIsOpen ? '' : (!this.privateIsOpen).toString();
    }

    handleKeyDown(event) {
        switch (event.keyCode) {
            case keyCodes.up:
            case keyCodes.right:
            case keyCodes.down:
            case keyCodes.left:
                event.preventDefault();
                event.stopPropagation();
                this.privateAccordionSectionObserver.notifySectionKeyNav(
                    event.keyCode
                );
                break;
            default:
                break; // do nothing
        }
    }

    handleSelectSection() {
        this.pendingFocus = true;
        this.privateAccordionSectionObserver.notifySectionSelect();
    }

    registerSectionWithParent() {
        const detail = {
            targetId: this.privateUniqueId,
            targetName: this.name,
            openSection: this.openSection.bind(this),
            isOpen: this.isOpen.bind(this),
            closeSection: this.closeSection.bind(this),
            focusSection: this.focusSection.bind(this),
            ackParentAccordion: this.ackParentAccordion.bind(this),
        };

        // Accordion sections can be inside other shadows, therefore composed is needed here
        this.dispatchEvent(
            new CustomEvent('privateaccordionsectionregister', {
                bubbles: true,
                composed: true,
                cancelable: true,
                detail,
            })
        );
    }

    openSection() {
        this.privateIsOpen = true;
    }

    closeSection() {
        this.privateIsOpen = false;
    }

    focusSection() {
        // Browser gives the section button focus on click. This focus needs to be removed and reapplied to scroll the section into view.
        const sectionButton = this.template.querySelector(
            'button.section-control'
        );
        sectionButton.blur();
        sectionButton.focus();
    }

    isOpen() {
        return this.privateIsOpen;
    }

    /**
     * Once the section is registered in the accordion, this function will be called with an observer
     *
     * @param {Object} accordionSectionObserver - a private communication channel between the section and the parent accordion
     */
    ackParentAccordion(accordionSectionObserver) {
        this.privateAccordionSectionObserver = accordionSectionObserver;
    }
}
