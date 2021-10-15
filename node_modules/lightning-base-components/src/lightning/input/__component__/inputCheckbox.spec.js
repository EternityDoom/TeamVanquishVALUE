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

describe('lightning-input type=checkbox', () => {
    const type = 'checkbox';

    it('should be valid when set from false to true', () => {
        const element = createInput({
            type,
            checked: true,
            required: true,
        });

        return Promise.resolve()
            .then(() => {
                expect(element.validity.valid).toBe(true);
                element.checked = false;
            })
            .then(() => {
                expect(element.validity.valid).toBe(false);
                element.checked = true;
            })
            .then(() => {
                expect(element.validity.valid).toBe(true);
            });
    });

    it('should not allow selectionStart or selectionEnd to be set', () => {
        const element = createInput({
            type,
            checked: true,
            required: true,
        });

        element.focus();

        return Promise.resolve().then(() => {
            expect(() => {
                element.selectionEnd = 7;
            }).toThrow();

            expect(() => {
                element.selectionStart = 7;
            }).toThrow();
        });
    });
});
