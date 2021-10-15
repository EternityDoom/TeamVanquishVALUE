import { createElement } from 'lwc';
import Element from 'lightning/input';

const defaultParams = {
    name: 'input',
    label: 'input',
};

const createInput = (params = {}) => {
    const element = createElement('lightning-input', { is: Element });
    Object.assign(element, defaultParams, params);
    document.body.appendChild(element);
    // set up some required attributes
    return element;
};

describe('lightning-input type=date', () => {
    it('should have autocomplete set to off', () => {
        const element = createInput({
            type: 'date',
        });

        return Promise.resolve().then(() => {
            const picker = element.shadowRoot.querySelector(
                'lightning-datepicker'
            );
            expect(picker.autocomplete).toBe('off');
        });
    });
});

describe('lightning-input type=time', () => {
    it('should have autocomplete set to off', () => {
        const element = createInput({
            type: 'time',
        });

        return Promise.resolve().then(() => {
            const picker = element.shadowRoot.querySelector(
                'lightning-timepicker'
            );
            expect(picker.autocomplete).toBe('off');
        });
    });
});

describe('lightning-input type=datetime', () => {
    it('should have autocomplete set to off', () => {
        const element = createInput({
            type: 'datetime',
        });

        return Promise.resolve().then(() => {
            const picker = element.shadowRoot.querySelector(
                'lightning-datetimepicker'
            );
            expect(picker.autocomplete).toBe('off');
        });
    });
});
