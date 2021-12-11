@isTest
private class ReviewTrackingHelperTest {
    @isTest static void ReviewTrackingHelperTest() {
            List<Recommendation__c> tst = Test.loadData(Recommendation__c.sObjectType, 'testSamples');
            Test.startTest();
            ReviewTrackingHelper.reviewTracker(tst);
            Test.stopTest();
    }
}
