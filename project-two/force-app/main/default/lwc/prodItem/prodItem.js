import { LightningElement,api,wire } from 'lwc';
import getRecordInfo from '@salesforce/apex/ProductInfo.getRecordInfo';
export default class ProdItem extends LightningElement {
    data=[];
    @wire(getRecordInfo) recordInfo;
    populateData({error, data}){
        if(data){
            this.data = data;
        }
    }
}