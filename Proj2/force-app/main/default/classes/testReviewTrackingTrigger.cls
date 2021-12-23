@isTest
public  class testReviewTrackingTrigger {
    @testSetup static void prodMake(){
        Product2 testProd = new Product2(Name = 'test');
        insert testProd;
    }
    @isTest
    private static void testReviewTracker(){
        Test.startTest();
        List<Product2> testProd = [SELECT Id FROM Product2 WHERE Name = 'test' LIMIT 1];
        List<Recommendation__c> testRevList = new List<Recommendation__c>();
        Recommendation__c testRev;
        for(Integer i=0; i<5;i++){
            testRev = new Recommendation__c(rating__c = String.valueOf(i));   
           	testRevList.add(testRev);
        }
        
        insert testRevList;
        Product2 t = [SELECT Id, Number_of_Reviews__c, Total_Review_Score__c FROM Product2 WHERE Name='test'];
        system.assertEquals(t.Number_of_Reviews__c, 5);
        Test.stopTest();
    }
}