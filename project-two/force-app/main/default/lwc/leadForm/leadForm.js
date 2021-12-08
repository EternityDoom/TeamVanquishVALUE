import { LightningElement, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import ACCOUNT_OBJECT from '@salesforce/schema/Account';
import NAME_FIELD from '@salesforce/schema/Account.Name';
import PHONE_FIELD from '@salesforce/schema/Account.Phone';
import EMAIL_FIELD from '@salesforce/schema/Account.Email__c';
import BILLINGADDRESS_FIELD from '@salesforce/schema/Account.BillingAddress'



export default class LeadEditForm extends LightningElement {
    
    @api recordId;
    @api objectApiName = ACCOUNT_OBJECT;
    fields = [NAME_FIELD, PHONE_FIELD, EMAIL_FIELD, BILLINGADDRESS_FIELD];

    name = NAME_FIELD;
    phone = PHONE_FIELD;
    email = EMAIL_FIELD;
    billingaddress = BILLINGADDRESS_FIELD;
 

    handleSuccess() {
        const toastEvent = new ShowToastEvent({
            title: 'Success',
            message: 'Record saved.',
            variant: 'success'
        });
        this.dispatchEvent(toastEvent);
    }
}