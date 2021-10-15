import { LightningElement } from 'lwc';
import fetchDataHelper from './fetchDataHelper';

const columns = [
    { label: 'Label', fieldName: 'name' },
    { label: 'Website', fieldName: 'website', type: 'url' },
    { label: 'Phone', fieldName: 'phone', type: 'phone' },
    { label: 'Balance', fieldName: 'amount', type: 'currency' },
    { label: 'CloseAt', fieldName: 'closeAt', type: 'date' },
];

export default class BasicDatatable extends LightningElement {
    data = [];
    columns = columns;
    rowOffset = 0;

    // eslint-disable-next-line @lwc/lwc/no-async-await
    async connectedCallback() {
        this.data = await fetchDataHelper({ amountOfRecords: 100 });
    }

    increaseRowOffset() {
        this.rowOffset += 100;
    }
}
