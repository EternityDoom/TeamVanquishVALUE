public with sharing class reviewList {
    @AuraEnabled(cacheable=true)
    public static List<Recommendation__c> getReviewList() {
        return [
            SELECT Id, Book__r.Name, Rating__c, Review__c, Review_Date__c
            FROM Recommendation__c
            ORDER BY Review_Date__c
            LIMIT 10
        ];
    }
}