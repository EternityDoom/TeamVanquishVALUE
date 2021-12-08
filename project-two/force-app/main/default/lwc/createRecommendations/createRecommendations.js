import { LightningElement } from 'lwc';

import RECOMMENDATION_NAME from '@salesforce/schema/Recommendation__c';
import BOOK_FIELD from '@salesforce/schema/Recommendation__c.Book__c';
import REVIEW_FIELD from '@salesforce/schema/Recommendation__c.Review__c';
import RATING_FIELD from '@salesforce/schema/Recommendation__c.Rating__c';
import OWNER_FIELD from '@salesforce/schema/Recommendation__c.OwnerId';

import { showToastEvent } from 'lightning/platformShowToastEvent';

/**
 * Creates Recommendation records.
 */
export default class RecommendationCreator extends LightningElement {

    recommendation__cObject = RECOMMENDATION_NAME;
    myFields = [
        OWNER_FIELD,
        BOOK_FIELD, 
        REVIEW_FIELD,
        RATING_FIELD,
    ];

/**
 * Toasty
 */
    handleRecommendationCreated(){
        const toastEvent = new showToastEvent({
            title: 'Success',
            message: 'Record saved.',
            variant: 'success'
        });
        this.dispatchEvent(toastEvent);
    }
}