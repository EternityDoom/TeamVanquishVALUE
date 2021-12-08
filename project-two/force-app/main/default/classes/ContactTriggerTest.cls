@isTest
public class ContactTriggerTest {
  static testMethod void validateAccount(){
    Contact c = new Contact(Phone='2222222222');
    Test.startTest();

    insert c;

    Test.stopTest();
  }
   
   
}
