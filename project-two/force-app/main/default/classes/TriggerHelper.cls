public with sharing class TriggerHelper {
    public static void AccountTriggerHelp(List<Account> accs) {
      for(Account a : accs){
        if(a.Email__c == null){
          a.addError('Missing Email address.');
        }
      }

    }
    
}