public class ReviewTrackingHelper {
    public static void reviewTracker(List<Recommendation__c> rev){
        
        List<Product2> ups = new List<Product2>();
        
        for (Recommendation__c r : rev){
            
            Product2 relRec = new Product2();
            relRec = r.Book__r;
        
        	relRec.Number_of_Reviews__c += 1;
        
        	relRec.Total_Review_Score__c += Integer.valueOf(r.Rating__c);
        
        	ups.add(relRec);
        }
        
         update ups;
        
        
        /*Product2 relRec = rev.Book__r;
        
        if(relRec.Number_of_Reviews__c == null){relRec.Number_of_Reviews__c = 1;}
        
        else relRec.Number_of_Reviews__c += 1;
        
        if(relRec.Total_Review_Score__c == null)relRec.Total_Review_Score__c = Integer.valueOf(rev.Rating__c);
        
        else relRec.Total_Review_Score__c += Integer.valueOf(rev.Rating__c);
        
        update relRec;*/
    }
}