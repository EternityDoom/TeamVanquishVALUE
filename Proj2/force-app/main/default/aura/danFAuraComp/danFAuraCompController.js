({
    handleClick : function(component, event){
        $A.get("e.force:refreshView").fire();
    },
    
    handleSubmit : function(component, event) {
        component.set('v.message', 'Submission Attempted!');
		component.set('v.binal3', 'true');        
    },
    
    handleSuccess : function(component, event, helper) {
        component.set('v.message', 'Submission Completed!');
        component.set('v.binal', 'false');
        component.set('v.binal2', 'true');
    }
})