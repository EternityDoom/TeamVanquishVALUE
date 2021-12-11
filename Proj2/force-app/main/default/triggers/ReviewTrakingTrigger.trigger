trigger ReviewTrakingTrigger on Recommendation__c (before insert) {
    if(Trigger.isInsert){
        ReviewTrackingHelper.reviewTracker(trigger.new);
    }
}