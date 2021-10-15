import { LightningElement, api } from 'lwc';
import { classSet } from 'lightning/utils';

/**
 * Displays a circular progress indicator to provide feedback about an action or process.
 * This component requires API version 48.0 and later.
 */
export default class progressRing extends LightningElement {
    /**
     * The percentage value of the progress ring. The value must be a number from 0 to 100.
     * A value of 50 corresponds to a color fill of half the ring in a clockwise
     * or counterclockwise direction, depending on the direction attribute.
     * @type {number}
     * @default 0
     */
    @api value = 0;

    /**
     * Changes the appearance of the progress ring.
     * Accepted variants include base, active-step, warning, expired, base-autocomplete.
     *
     * @type {string}
     * @default 'base'
     */
    @api variant = 'base';

    /**
     * Controls which way the color flows from the top of the ring, either clockwise or counterclockwise
     * Valid values include fill and drain. The fill value corresponds to a color flow in the clockwise direction.
     * The drain value indicates a color flow in the counterclockwise direction.
     *
     * @type {string}
     * @default 'fill'
     */
    @api direction = 'fill';

    /**
     * The size of the progress ring. Valid values include medium and large.
     *
     * @type {string}
     * @default 'medium'
     */
    @api size = 'medium';

    get d() {
        const fillPercent = this.value / 100;
        const filldrain = this.direction === 'drain' ? 1 : 0;
        const inverter = this.direction === 'drain' ? 1 : -1;
        const islong = fillPercent > 0.5 ? 1 : 0;

        const subCalc = 2 * Math.PI * fillPercent;

        const arcx = Math.cos(subCalc);
        const arcy = Math.sin(subCalc) * inverter;

        return `M 1 0 A 1 1 0 ${islong} ${filldrain} ${arcx} ${arcy} L 0 0`;
    }

    get iconSvg() {
        if (this.variant === 'warning') {
            return 'M23.7 19.6L13.2 2.5c-.6-.9-1.8-.9-2.4 0L.3 19.6c-.7 1.1 0 2.6 1.1 2.6h21.2c1.1 0 1.8-1.5 1.1-2.6zM12 18.5c-.8 0-1.4-.6-1.4-1.4s.6-1.4 1.4-1.4 1.4.6 1.4 1.4-.6 1.4-1.4 1.4zm1.4-4.2c0 .3-.2.5-.5.5h-1.8c-.3 0-.5-.2-.5-.5v-6c0-.3.2-.5.5-.5h1.8c.3 0 .5.2.5.5v6z';
        }
        if (this.variant === 'expired') {
            return 'M12 .9C5.9.9.9 5.9.9 12s5 11.1 11.1 11.1 11.1-5 11.1-11.1S18.1.9 12 .9zM3.7 12c0-4.6 3.7-8.3 8.3-8.3 1.8 0 3.5.5 4.8 1.5L5.2 16.8c-1-1.3-1.5-3-1.5-4.8zm8.3 8.3c-1.8 0-3.5-.5-4.8-1.5L18.8 7.2c1 1.3 1.5 3 1.5 4.8 0 4.6-3.7 8.3-8.3 8.3z';
        }
        if (this.isComplete) {
            return 'M8.8 19.6L1.2 12c-.3-.3-.3-.8 0-1.1l1-1c.3-.3.8-.3 1 0L9 15.7c.1.2.5.2.6 0L20.9 4.4c.2-.3.7-.3 1 0l1 1c.3.3.3.7 0 1L9.8 19.6c-.2.3-.7.3-1 0z';
        }
        return undefined;
    }

    get computedAltText() {
        if (this.variant === 'warning') {
            return 'Warning';
        }
        if (this.variant === 'expired') {
            return 'Expired';
        }
        if (this.isComplete) {
            return 'Complete';
        }
        return undefined;
    }

    get computedOuterClass() {
        return classSet('slds-progress-ring').add({
            'slds-progress-ring_large': this.size === 'large',
            'slds-progress-ring_warning': this.variant === 'warning',
            'slds-progress-ring_expired': this.variant === 'expired',
            'slds-progress-ring_active-step': this.variant === 'active-step',
            'slds-progress-ring_complete': this.isComplete,
        });
    }

    get computedIconTheme() {
        return classSet('slds-icon_container').add({
            'slds-icon-utility-warning': this.variant === 'warning',
            'slds-icon-utility-error': this.variant === 'expired',
            'slds-icon-utility-success': this.isComplete,
        });
    }

    get isComplete() {
        return (
            this.variant === 'base-autocomplete' && Number(this.value) === 100
        );
    }
}
