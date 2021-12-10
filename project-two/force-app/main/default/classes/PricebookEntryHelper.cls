public with sharing class PricebookEntryHelper {
    public static void AddPrice(List<Product2> prolist){
        Pricebook2 pb= [SELECT id from Pricebook2 where IsStandard = true];
    	list<PricebookEntry> pbe= new list<PricebookEntry>();
        for(Product2 pro: prolist){
            	pbe.add(new PricebookEntry(product2id=pro.id,pricebook2id=pb.id,unitprice=100));
    	}
    	insert pbe;
	}
}