import { createElement } from 'lwc';
import Element from 'lightning/icon';

function createIcon(props = {}) {
    const element = createElement('lightning-icon', { is: Element });

    Object.assign(element, props);
    document.body.appendChild(element);
    return element;
}

function verifySvgDataKey(element, value) {
    const primitiveIcon = element.shadowRoot.querySelector(
        'lightning-primitive-icon'
    );
    const svg = primitiveIcon.shadowRoot.querySelector('svg');
    expect(svg.getAttribute('data-key')).toBe(value);
}

describe('lightning-icon', () => {
    it('should render with prebuilt icon for utility', () => {
        const element = createIcon({
            iconName: 'utility:check',
        });

        verifySvgDataKey(element, 'check');
    });
    it('should render with prebuilt icon for standard', () => {
        const element = createIcon({
            iconName: 'standard:account',
        });

        verifySvgDataKey(element, 'account');
    });

    it('should render with prebuilt icon for action', () => {
        const element = createIcon({
            iconName: 'action:back',
        });

        verifySvgDataKey(element, 'back');
    });

    it('should render with prebuilt icon for doctype', () => {
        const element = createIcon({
            iconName: 'doctype:image',
        });

        verifySvgDataKey(element, 'image');
    });

    it('should render with prebuilt icon for custom', () => {
        const element = createIcon({
            iconName: 'custom:custom1',
        });

        verifySvgDataKey(element, 'custom1');
    });
});
