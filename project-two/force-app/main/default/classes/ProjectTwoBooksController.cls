public with sharing class ProjectTwoBooksController {
    
  @AuraEnabled
  public static List<Product2> getBooks() {
    return [SELECT Id, Name, Description
  			FROM Product2];
  }
    
  @AuraEnabled
  public static List<Product2> getBooksAndAuthor() {
    return [SELECT Name, Description, Author__r.Name
      FROM Product2];
  }
    
      @AuraEnabled
  public static List<Recommendation__c> getBookRecommendations() {
    return [SELECT Name, Review__c, Rating__c, Book__r.Name, Book__r.Author__r.Name
      FROM Recommendation__c
      WHERE Book__c != null];
  }
    
      @AuraEnabled
  public static List<Product2> getBooksWithoutAuthors(){
    return [SELECT Name
      FROM Product2
      WHERE Author__c = null];
  }
}