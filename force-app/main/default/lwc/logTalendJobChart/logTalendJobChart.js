import { LightningElement, track, api,wire } from 'lwc';
import { subscribe, unsubscribe, onError, setDebugFlag, isEmpEnabled } from 'lightning/empApi';
import createLabelList from '@salesforce/apex/TalendJobDataProvider.createLabelList';
import createDetailList from '@salesforce/apex/TalendJobDataProvider.createDetailList';
import {
    refreshApex
} from '@salesforce/apex';
import {
    CurrentPageReference
} from 'lightning/navigation';
import { updateRecord } from 'lightning/uiRecordApi';

export default class LogTalendJobChart extends LightningElement {

    //CHART PART

    @api recordId;
    @api nomJob;
     labelList = '';
     detailList = '';
     error = '';
     titleJobName = '';
    
    @wire(createLabelList, { jobName: '$titleJobName' }) resultLabelList;
    @wire(createDetailList, { jobName: '$titleJobName' }) resultDetailList;

    //SUBSCRIBE PART
    channelName = '/topic/NewTalendJob';
    isSubscribeDisabled = false;
    isUnsubscribeDisabled = !this.isSubscribeDisabled;
    subscription = {};

    //FUNCTIONS

    connectedCallback() {
        
        this.handleLoad();    
        this.registerErrorListener();    
        this.handleSubscribe();
    }

    handleLoad() {
        this.titleJobName = this.nomJob;
        console.log('handleLoad - resultLabelList.data: ', JSON.stringify(this.resultLabelList.data));
        console.log('handleLoad - resultDetailList.data: ', JSON.stringify(this.resultDetailList.data));
        
    }

    handleReload() {
        console.log('handleReload');
        return refreshApex(this.resultLabelList);
    }

    // Tracks changes to channelName text field
    handleChannelName(event) {
        this.channelName = event.target.value;
    }


    // Handles subscribe button click
    handleSubscribe() {
        // Callback invoked whenever a new event message is received
        var selfi = this;

        const messageCallback = function(response) {

            console.log('handleSubscribe - New message received: ', JSON.stringify(response));
            console.log('handleSubscribe - RefreshApex start');

            refreshApex(selfi.resultDetailList);
            refreshApex(selfi.resultLabelList);
            console.log('handleSubscribe - RefreshApex end ');
            return;
            

        };

        // Invoke subscribe method of empApi. Pass reference to messageCallback
        subscribe(this.channelName, -1, messageCallback).then(response => {
            // Response contains the subscription information on subscribe call
            console.log('Subscription request sent to: ', JSON.stringify(response.channel));
            this.subscription = response;
            this.toggleSubscribeButton(true);
        });

    }

    // Handles unsubscribe button click
    handleUnsubscribe() {
        this.toggleSubscribeButton(false);

        // Invoke unsubscribe method of empApi
        unsubscribe(this.subscription, response => {
            console.log('unsubscribe() response: ', JSON.stringify(response));
            // Response is true for successful unsubscribe
        });
    }

    toggleSubscribeButton(enableSubscribe) {
        this.isSubscribeDisabled = enableSubscribe;
        this.isUnsubscribeDisabled = !enableSubscribe;
    }

    registerErrorListener() {
        // Invoke onError empApi method
        onError(error => {
            console.log('Received error from server: ', JSON.stringify(error));
            // Error contains the server-side error
        });
    }



}