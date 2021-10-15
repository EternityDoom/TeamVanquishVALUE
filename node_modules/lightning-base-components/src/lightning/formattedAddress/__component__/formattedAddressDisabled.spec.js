import { createElement } from 'lwc';

import Element from 'lightning/formattedAddress';

function createHtml(props = {}) {
    const element = createElement('x-basic', { is: Element });
    Object.assign(element, props);
    document.body.appendChild(element);
    return element;
}

describe('lightning-formatted-address', () => {
    it('should disable component', () => {
        const element = createHtml({
            disabled: true,
        });

        expect(element.disabled).toBeTruthy();
    });
});
