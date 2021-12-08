trigger AccountTrigger on Account (before insert, before update) {
  if(Trigger.isBefore){
    if(Trigger.isInsert){
      TriggerHelper.AccountTriggerHelp(Trigger.new);
    }
    if(Trigger.isUpdate){
      TriggerHelper.AccountTriggerHelp(Trigger.old);
    }
      
  }

}