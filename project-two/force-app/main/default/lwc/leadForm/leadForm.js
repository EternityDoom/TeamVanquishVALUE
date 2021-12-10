import { LightningElement, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import CONTACT_OBJECT from '@salesforce/schema/Contact';
import FIRSTNAME_FIELD from '@salesforce/schema/Contact.FirstName';
import LASTNAME_FIELD from '@salesforce/schema/Contact.LastName'
import PHONE_FIELD from '@salesforce/schema/Contact.Phone';
import EMAIL_FIELD from '@salesforce/schema/Contact.Email';
import MAILINGADDRESS_FIELD from '@salesforce/schema/Contact.MailingAddress'
import ACCOUNTNAME_FIELD from '@salesforce/schema/Contact.AccountId'


export default class LeadEditForm extends LightningElement {
    
    @api recordId;
    @api objectApiName = CONTACT_OBJECT;
    fields = [ACCOUNTNAME_FIELD, FIRSTNAME_FIELD, LASTNAME_FIELD, PHONE_FIELD, EMAIL_FIELD, MAILINGADDRESS_FIELD];

    accountname = ACCOUNTNAME_FIELD;
    firstname = FIRSTNAME_FIELD;
    lastname = LASTNAME_FIELD;
    phone = PHONE_FIELD;
    email = EMAIL_FIELD;
    mailingaddress = MAILINGADDRESS_FIELD;
 

    handleSuccess() {
        const toastEvent = new ShowToastEvent({
            title: 'Success',
            message: 'Record saved.',
            variant: 'success'
        });
        this.dispatchEvent(toastEvent);
    }
}