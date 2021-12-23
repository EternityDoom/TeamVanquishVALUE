trigger ReviewTrackingTrigger on Recommendation__c (after insert) {
    if(Trigger.isInsert){
        ReviewTrackingHelper.reviewTracker();
    }
}