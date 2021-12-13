@isTest
public with sharing class testReviewTrackingTrigger {
    private static testMethod void testReviewTracker(){
        List<Recommendation__c> testRevList = new List<Recommendation__c>();
        Recommendation__c testRev;
        for(Integer i=0; i<5;i++){
            testRev = new Recommendation__c();
            switch on i{
                when 0{
                    testRev.Rating__c = '1';
                    break;
                }
                when 1{
                    testRev.Rating__c = '2';
                    break;
                }
                when 2{
                    testRev.Rating__c = '3';
                    break;
                }
                when 3{
                    testRev.Rating__c = '4';
                    break;
                }
                when 4{
                    testRev.Rating__c = '5';
                    break;
                }
            }            
            testRevList.add(testRev);
        }
        Test.startTest();
        insert testRevList;
        Test.stopTest();
    }
}