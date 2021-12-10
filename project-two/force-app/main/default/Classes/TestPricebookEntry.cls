@isTest
public class TestPriceBookEntryTrigger {
	
    @isTest 
    static void createProduct(){
        
        Product2 prod = new Product2(Name = 'Laptop X20');
        insert prod;
        
		Id pricebookId = Test.getStandardPricebookId();
        
        PricebookEntry standardPrice = new PricebookEntry(
            Pricebook2Id = pricebookId, Product2Id = prod.Id,
            UnitPrice = 10000, IsActive = true);
        
        Test.startTest();
        Database.DeleteResult result = Database.delete(standardPrice, false);
        Test.stopTest();
        
        System.assert(!result.isSuccess());
    }
}