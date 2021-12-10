public with sharing class TriggerHelper {
    public static void ContactTriggerHelp(List<Contact> conts) {
      for(Contact c : conts){
       
        if(c.Email == null){
          c.addError('Missing Email Address.');
        }
       
       
       
      }

    }
    
}