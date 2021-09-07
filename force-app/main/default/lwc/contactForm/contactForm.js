import { LightningElement,api,
    wire,track                                                           
    } from 'lwc';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import CONTACT_OBJECT from '@salesforce/schema/Contact';
import Option__c from '@salesforce/schema/Contact.Option__c';
import createcContactRecordOnTerm from "@salesforce/apex/ContactFormController.createcContactRecordOnTerm";
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
//import { NavigationMixin } from 'lightning/navigation';
export default class ContactForm extends LightningElement {
    @api a_Term_Ref;
    @api a_Forecast_Amount_Ref;
    @api a_Start_Date_Ref;
    @api a_Incremental_Ref;
    @track value;
    
    @wire(getObjectInfo, { objectApiName: CONTACT_OBJECT })
    contactInfo;
    @wire(getPicklistValues,
        {
            recordTypeId: '$contactInfo.data.defaultRecordTypeId',
            fieldApiName: Option__c
        }
    )
    optionValues;
    handleTermChange(event) {
        this.a_Term_Ref = event.detail.value;
    }
    handleForecastAmountChange(event) {
        this.a_Forecast_Amount_Ref = event.detail.value;
    }
    handleStartDateChange(event){
        this.a_Start_Date_Ref = event.detail.value;
    }
    handleIncrementalChange(event) {
        this.a_Incremental_Ref = event.detail.value;                     
    }
    handleOptionChange(event){
        this.value = event.detail.value;
    }
    handleSave(event){
        //console.log(">>>",Option__c);
        if(this.a_Term_Ref == null || this.a_Incremental_Ref == null || this.a_Start_Date_Ref == null || this.a_Forecast_Amount_Ref == null || this.value == null){
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: 'Fill The Value in required field',
                    variant: 'error'
                })
             );
        }
        else{
            createcContactRecordOnTerm({ 
               term : this.a_Term_Ref, 
               forecastAmount : this.a_Forecast_Amount_Ref, 
               startDate : this.a_Start_Date_Ref,
               incremental : this.a_Incremental_Ref,
               option : this.value
           })
           .then(result => {
              this.message = result;
              this.error = undefined;
              if(this.message !== undefined) {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message:  this.a_Term_Ref +' '+ 'New Contact ' +' created.',
                        variant: 'success'
                    }),
                );
                window.location.reload();
              }
           })
           .catch(error => {
              this.message = undefined;
              this.error = error;
              this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error creating record',
                    message: error.body.message,
                    variant: 'error',
                }),
            );
           });
        }
     
    }
}