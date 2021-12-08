@isTest
private class AccountTriggerTest {
  static testMethod void validateAccount(){
    Account a = new Account(Name='John');
    Test.startTest();

    insert a;

    Test.stopTest();
  }
   
   
}
