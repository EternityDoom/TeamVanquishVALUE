/* eslint-disable @lwc/lwc/no-async-await */
/* eslint-disable @lwc/lwc/no-document-query */
/* eslint-disable @lwc/lwc/no-async-operation */
/* eslint-disable @lwc/lwc/no-rest-parameter */
/* eslint-disable no-await-in-loop */
import { createElement } from 'lwc';
import Basic from 'x/basic';

function createHtml(props = {}) {
    const element = createElement('x-basic', { is: Basic });
    Object.assign(element, props);
    document.body.appendChild(element);
    return element;
}

function wait(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

async function waitFor(callback) {
    let msToWait = [50, 100, 150, 200, 250, 500, 1000];
    let waiting = true;
    while (waiting) {
        let [msToWaitNow, ...msToWaitNext] = msToWait;
        msToWait = msToWaitNext;
        if (msToWaitNow !== undefined) {
            await wait(msToWaitNow);
            if (callback()) {
                return true;
            }
        }
    }
    return false;
}

describe('lightning-formatted-address', () => {
    it('should render the address with map', async () => {
        const element = createHtml();

        const formattedAddress = element.shadowRoot.querySelector(
            'lightning-formatted-address'
        );

        const staticMap = formattedAddress.shadowRoot.querySelector(
            'lightning-static-map'
        );

        const updated = await waitFor(() => {
            const iframe = staticMap.shadowRoot
                .querySelector('lightning-primitive-iframe')
                .shadowRoot.querySelector('iframe');

            const value = iframe.style.display;

            return value === 'inherit';
        });
        expect(updated).toBeTruthy();
    });
});
