public class recommendationcDuplicateCheck {

    public static void recommendationcCheckBook(List<Recommendation__c> recommendationObjList){
        Set<String> setStr = new Set<String>();
//        List<Recommendation__c> recommendationcObj = new List<recommendation__c>();
        List<Recommendation__c> recommendationcList=[Select Book__c From Recommendation__c
                                                    WHERE OwnerId = :UserInfo.getUsername()];
    
        for(Recommendation__c d1:recommendationcList){
            setStr.add(d1.Book__c);
        	}
        
        for(Recommendation__c e1:recommendationObjList){
            if(setStr.contains(e1.Book__c)){
                e1.Book__c.addError('You have already submitted a recommendation on this book.');
            }
        }
    }
}