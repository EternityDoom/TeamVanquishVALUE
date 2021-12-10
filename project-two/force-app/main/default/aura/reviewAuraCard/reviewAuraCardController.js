({
  init : function(component, row) {
    var action = component.get("c.deleteRecord");
    action.setParams({
      "toDelete":row
    });
    $A.enqueueAction(action);
    }
 
  
})