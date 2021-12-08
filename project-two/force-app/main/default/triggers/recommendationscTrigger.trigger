trigger recommendationscTrigger on Recommendation__c (before insert) {
    
    if ((trigger.isBefore) && 
       ((trigger.isInsert) || (trigger.isUpdate))){
            recommendationcDuplicateCheck.recommendationcCheckBook(trigger.new);                 
    }    
}