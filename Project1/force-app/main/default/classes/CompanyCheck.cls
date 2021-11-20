public with sharing class CompanyCheck {
    public static CompanyCheck(String coEntry) {

        String checking = coEntry;
        if([SELECT Company FROM Lead /*WHERE Company LIKE /*Find way to insert string for comparison*/]){
            //if record found, display error messege on page and stop redord creation
        }
    }
}
