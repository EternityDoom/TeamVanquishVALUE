import { createElement } from 'lwc';
import Tall from 'x/tall';
import { animationFrame } from 'lightning/utilsPrivate';

const createTallPageWithInput = (params = {}) => {
    const element = createElement('x-tall', { is: Tall });
    Object.assign(element, params);
    return element;
};

describe('lightning-input type=number', () => {
    describe('focus', () => {
        let element;
        beforeEach(() => {
            element = createTallPageWithInput();
            document.body.appendChild(element);
        });

        afterEach(() => {
            document.body.removeChild(element);
        });

        it('should scroll into view when focused', async () => {
            const root = document.querySelector('x-tall').shadowRoot;

            // Measure where the elements are on the page so we can tell later if they're on-screen.
            let inputY =
                window.pageYOffset +
                root.querySelector('lightning-input').getBoundingClientRect().y;
            let buttonY =
                window.pageYOffset +
                root.querySelector('button').getBoundingClientRect().y;

            // 1. Focus the button at the bottom
            root.querySelector('button').scrollIntoView();
            root.querySelector('button').focus();

            expect(document.activeElement.tagName.toLowerCase()).toBe(
                'x-tall',
                'the focused component should be x-tall'
            );
            expect(root.activeElement.tagName.toLowerCase()).toBe(
                'button',
                'the focused element in x-tall should be the button'
            );

            const isButtonOnScreen =
                buttonY >= window.pageYOffset &&
                buttonY <= window.pageYOffset + window.innerHeight;
            expect(isButtonOnScreen).toBe(
                true,
                'Page did not scroll when the button was focused.'
            );

            // 2. Click the button to send focus to the input
            root.querySelector('button').click();

            // Click has async text selection, so we wait a moment for the browser to actually move focus.
            await animationFrame();

            expect(root.activeElement.tagName.toLowerCase()).toBe(
                'lightning-input',
                'active element was not lightning-input'
            );

            const isInputOnScreen =
                inputY >= window.pageYOffset &&
                inputY <= window.pageYOffset + window.innerHeight;
            expect(isInputOnScreen).toBe(
                true,
                'Page did not scroll to input when focus was sent there.'
            );
        });
    });
});
