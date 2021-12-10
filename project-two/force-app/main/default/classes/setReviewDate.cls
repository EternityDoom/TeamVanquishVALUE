public with sharing class setReviewDate {
    public static void setReviewDate(List<Recommendation__c> current) {
        for(Recommendation__c l : current){
            if(l.Review_Date__c == null) {
                l.Review_Date__c = Date.today();
            }
        }
    }
}