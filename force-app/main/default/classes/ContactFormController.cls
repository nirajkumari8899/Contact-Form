public with sharing class ContactFormController {
    @AuraEnabled
    Public static void createcContactRecordOnTerm(Integer term, Decimal forecastAmount, Date startDate, Integer incremental, String option){
        Decimal totalForecastAmount;
        totalForecastAmount=0;
        try{
            List<Contact> lstContact = new list<Contact>();
            for(integer i=0; i < term; i++){
                Contact conobj = new Contact();
                conobj.LastName = 'testcontact'+i;
                conobj.End_Date__c = startDate.addMonths(i+1).toStartofMonth().addDays(-1);
                conobj.Option__c = option;
                conobj.Incremental_increase_decrease__c = incremental;
                if(i==0){
                    conobj.Start_Date__c = startDate;
                    conobj.Forecast_Amount_per_month__c = forecastAmount;
                    totalForecastAmount = forecastAmount;
                }
                else{
                    conobj.Start_Date__c = startDate.addMonths(i).toStartofMonth();
                    if(conobj.Option__c == 'Uplift'){
                        totalForecastAmount  = totalForecastAmount + ((totalForecastAmount * conobj.Incremental_increase_decrease__c) / 100);  
                        conobj.Forecast_Amount_per_month__c = totalForecastAmount;
                    }
                    else{
                        totalForecastAmount =  totalForecastAmount - ((totalForecastAmount * conobj.Incremental_increase_decrease__c) / 100); 
                        conobj.Forecast_Amount_per_month__c = totalForecastAmount;
                    }
                }
                lstContact.add(conobj);  
            }
            if(!lstContact.isEmpty())
            {
                insert lstContact ;
            }
            system.debug(lstContact);
        }
        catch(Exception ex){
            System.debug('An Exception: '+ex);
        }
    }
}