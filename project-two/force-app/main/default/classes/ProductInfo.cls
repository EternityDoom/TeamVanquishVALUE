public with sharing class ProductInfo {
    @AuraEnabled(cacheable=true)
    public static List<SObject> getRecordInfo(){
        return [
            SELECT ID, Name, DisplayUrl
            FROM Product2 
            WHERE IsActive=TRUE and DisplayUrl != NULL
            WITH SECURITY_ENFORCED
        ];
    }
}