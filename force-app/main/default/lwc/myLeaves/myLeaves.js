import { LightningElement,wire } from 'lwc';
import getMyLeaves from '@salesforce/apex/LeaveRequstController.getMyLeaves';
import Object from '@salesforce/schema/LeaveRequest__c'
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import Id from '@salesforce/user/Id';
import {refreshApex} from '@salesforce/apex'
const columns=[{label:'Request Id',fieldName:'Name',cellAttributes:{class:{fieldName:'cellClass'}}},
{label:'From Date',fieldName:'From_Date__c',cellAttributes:{class:{fieldName:'cellClass'}}},
{label:'To Date',fieldName:'To_Date__c',cellAttributes:{class:{fieldName:'cellClass'}}},
{label:'Reason',fieldName:'Reason__c',cellAttributes:{class:{fieldName:'cellClass'}}},
{label:'Status',fieldName:'Status__c',cellAttributes:{class:{fieldName:'cellClass'}}},
{label:'Manager Comment',fieldName:'Manager_Comment__c',cellAttributes:{class:{fieldName:'cellClass'}}},
{type:'button',typeAttributes:{
    name:'Edit',
    value:'edit',
    label:'Edit',cellAttributes:{class:{fieldName:'cellClass'}},
    disabled:{fieldName:'isEditDisabled'}

}}]
export default class MyLeaves extends LightningElement {

    data= [];
    currentUserId=Id;
    recordId ='';
    columns=  columns;
    objectApiName= Object
    showModal= false;
    @wire(getMyLeaves)
    wiredResponse({data,error}){
        if(data){
            console.log(data);
            this.data=data.map(result=>({
                ...result,
                cellClass:result.Status__c=='Approved' ? 'slds-theme_success':result.Status__c=='Rejected'?'slds-theme_warning':'',
                isEditDisabled:result.Status__c != 'Pending'

            }));
        }

        else if(error){
            console.log(JSON.parse(JSON.stringify(error)));
        }
    }

    get noRecords(){
        return this.data.length==0;
    }

    rowHandler(event){
this.showModal=true;
this.recordId=event.detail.row.Id;
        
    }

    hideShowModal(){
        this.showModal=false;
    }


    successHandler(event){

        this.showModal= false;
        this.showToast("Data Saved Successfully");
        refreshApex(this.data);
        
          

    }

    showToast(message,title,variant){

        const event = new ShowToastEvent({
               title,
               message,
               variant
        })
        this.dispatchEvent(event);
    }
    newLeaveRequest(){

        this.showModal =true;
        this.recordId='';
        
    }
    testDataHandler(event){
        event.preventDefault(fields);
        const fields={...event.detail.fields};

        fields.Status__c='Pending';

        if(new Date(fields.From_Date__c)> new Date(fields.To_Date__c)){

            this.showToast("From Date Should be less Than To Date","Error","error");
        }
        else if(new Date(fields.From_Date__c) < new Date()){
      
            this.showToast("From Date Should not be less than today","Error","error");

        }
        else{

            this.refs.leaveRequestForm.submit(fields);
        }


    }

    
}