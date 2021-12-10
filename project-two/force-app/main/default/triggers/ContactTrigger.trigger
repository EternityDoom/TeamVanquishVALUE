trigger ContactTrigger on Contact (before insert) {
  if(Trigger.isBefore){
    if(Trigger.isInsert){
      TriggerHelper.ContactTriggerHelp(Trigger.new);
    }
    
      
  }

}