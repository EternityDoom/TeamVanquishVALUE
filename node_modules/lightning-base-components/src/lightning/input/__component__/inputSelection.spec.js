import { createElement } from 'lwc';
import Element from 'lightning/input';

const defaultParams = {
    name: 'input',
    label: 'input',
};

const ERROR_INPUT_TYPES = ['range', 'file', 'checkbox'];

const VALID_INPUT_TYPES_W_VALUE = [
    // the W3 standards
    ['text', 'default string of joy'],
    ['search', 'beavis inc'],
    ['tel', 345987345],
    ['url', 'http://www.beavis.com'],
    ['password', 'beavis9000'],

    // some of the components that work bc our component is an enhancement above w3!
    ['email', 'acdc@beavis.com'],
];

const createInput = (params = {}) => {
    const element = createElement('lightning-input', { is: Element });
    Object.assign(element, defaultParams, params);
    document.body.appendChild(element);
    return element;
};

describe('lightning-input', () => {
    describe('selectionStart and selectionEnd', () => {
        let element = null;
        afterEach(() => {
            document.body.removeChild(element);
        });

        ERROR_INPUT_TYPES.forEach((type) => {
            it(`should not allow selectionStart or selectionEnd to be set when type is ${type}`, () => {
                element = createInput({
                    type,
                });

                element.focus();
                return Promise.resolve().then(() => {
                    expect(() => {
                        element.selectionStart = 3;
                    }).toThrow();

                    expect(() => {
                        element.selectionEnd = 7;
                    }).toThrow();

                    expect(element.selectionStart).toBe(null);
                    expect(element.selectionEnd).toBe(null);
                });
            });
        });

        VALID_INPUT_TYPES_W_VALUE.forEach(([type, value]) => {
            it(`should be valid when set after focus when type is ${type} w/ ${value}`, () => {
                element = createInput({
                    type,
                    value,
                    required: true,
                });

                element.focus();
                element.selectionStart = 3;
                element.selectionEnd = 7;

                const inputElement = element.shadowRoot.querySelector('input');

                return Promise.resolve().then(() => {
                    expect(inputElement.selectionStart).toBe(3);
                    expect(inputElement.selectionEnd).toBe(7);

                    expect(element.selectionStart).toBe(3);
                    expect(element.selectionEnd).toBe(7);
                });
            });
        });
    });
});
