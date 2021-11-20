import { LightningElement, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import LEAD_OBJECT from '@salesforce/schema/Lead';
import NAME_FIELD from '@salesforce/schema/Lead.Name';
import PHONE_FIELD from '@salesforce/schema/Lead.Phone';
import EMAIL_FIELD from '@salesforce/schema/Lead.Email';
import WEBSITE_FIELD from '@salesforce/schema/Lead.Website';
import ADDRESS_FIELD from '@salesforce/schema/Lead.Address';
import COMPANY_FIELD from '@salesforce/schema/Lead.Company';
import DESCRIPTION_FIELD from '@salesforce/schema/Lead.Description';
import CASE_OBJECT from '@salesforce/schema/Case';
import DESCRIPTION from '@salesforce/schema/Case.Description';



export default class Interactions extends LightningElement {
    @api lead = LEAD_OBJECT;
    @api guest = CASE_OBJECT;

    fieldsLead = [NAME_FIELD, PHONE_FIELD, EMAIL_FIELD, WEBSITE_FIELD, ADDRESS_FIELD, COMPANY_FIELD, DESCRIPTION_FIELD];
    fieldsCase = [DESCRIPTION];
   
   
    handleSuccess(event) {
        const evt = new ShowToastEvent({
            title: 'New Record Created',
            message: 'Record ID: ' + event.detail.id,
            variant: 'success',
        });
        this.dispatchEvent(evt);
    }

   
}