public class ReviewTrackingHelper {
    public static void reviewTracker(){
        //Retrieve data from trigger
        List<Recommendation__c> newRevs = Trigger.new;
        Map<Id, Recommendation__c> relatedObjIds = new Map<Id, Recommendation__c>();        
        for (Recommendation__c r : newRevs){
            relatedObjIds.put(r.Book__c, r);
        }
        //Retrieve parent data from lookup relationship
        List<Product2> books = [SELECT Id, Number_of_Reviews__c, Total_Review_Score__c FROM Product2 WHERE Id IN :relatedObjIds.keySet()];    
        //Make required updates
        for(Product2 b : books){
            Recommendation__c rev = relatedObjIds.get(b.Id);
            if(b.Number_of_Reviews__c == null){
                b.Number_of_Reviews__c = 1;
            }else{
                b.Number_of_Reviews__c += 1;
            }
            if(b.Total_Review_Score__c == null){
                b.Total_Review_Score__c = Integer.valueOf(rev.Rating__c);
            }else{
                b.Total_Review_Score__c += Integer.valueOf(rev.Rating__c);
            }
        }
        //Execute DML operations
        update books;
    } 
}