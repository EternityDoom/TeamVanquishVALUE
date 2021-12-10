@isTest
public class ContactTriggerTest {
    @isTest static void contactCheckTest(){
        Contact c = new Contact();
        c.LastName = 'Test';
        c.Email = 'testeeesttt321@gmail.com';

        Test.startTest();
        Database.SaveResult sr = Database.insert(c, false);
        Test.stopTest();
        
        
             
    }

}
