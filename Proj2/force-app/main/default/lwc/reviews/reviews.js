import { LightningElement, api, wire, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import reviews from '@salesforce/apex/reviewList.getReviewList';

import REVIEWS from '@salesforce/schema/Recommendation__c';
import BOOK_FIELD from '@salesforce/schema/Recommendation__c.Book__c';
import RATING_FIELD from '@salesforce/schema/Recommendation__c.Rating__c';
import REVIEW_FIELD from '@salesforce/schema/Recommendation__c.Review__c';
import DATE_FIELD from '@salesforce/schema/Recommendation__c.Review_Date__c';



export default class Reviews extends LightningElement {
    @api recordId;
    @api reviewsTab = REVIEWS;
    @track columns = [
        {label: 'Book', fieldName: 'Book__r.Name', type: 'text'},
        {label: 'Rating', fieldName: 'Rating__c', type: 'picklist'},
        {label: 'Review', fieldName: 'Review__c', type: 'text'},
        {label: 'Date Reviewed', fieldName: 'Review_Date__c', type: 'date'}
    ];
    @track error;
    @track reviewList;
    @wire(reviews) reviewTable({error, data}){
        if (data) {
            this.reviewList = data;
        } else if (error) {
            this.error = error;
        }
    };
    fields = [BOOK_FIELD, RATING_FIELD, REVIEW_FIELD, DATE_FIELD];
    data = [];
    handleSuccess(event) {
        const evt = new ShowToastEvent({
            title: 'New Record Created',
            message: 'Record ID: ' + event.detail.id,
            variant: 'success',
        });
        this.dispatchEvent(evt);
    }
}