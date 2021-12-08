trigger ContactTrigger on Contact (before insert, before update) {
  if(Trigger.isBefore){
    if(Trigger.isInsert){
      TriggerHelper.ContactTriggerHelp(Trigger.new);
    }
    if(Trigger.isUpdate){
      TriggerHelper.ContactTriggerHelp(Trigger.old);
    }
      
  }

}