trigger PricebookEntryTrigger on Product2  (after insert) {
    switch on Trigger.operationType{
        when AFTER_INSERT{
            PricebookEntryHelper.AddPrice(trigger.new);
        }
    }
}