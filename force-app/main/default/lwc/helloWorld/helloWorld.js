import { LightningElement, api, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { CloseActionScreenEvent } from 'lightning/actions';
import { getRecord } from 'lightning/uiRecordApi';
import MailingCity from '@salesforce/schema/Contact.MailingCity';
import MailingCountry from '@salesforce/schema/Contact.MailingCountry';
import MailingPostalCode from '@salesforce/schema/Contact.MailingPostalCode';
import MailingState from '@salesforce/schema/Contact.MailingState';
import MailingStreet from '@salesforce/schema/Contact.MailingStreet';
import getContacts from '@salesforce/apex/ContactController.getContacts';

export default class QuickEditFormExample extends LightningElement {

  @api recordId;
  @api objectApiName;
  pageToken = null;
  nextPageToken = null;
  previousPageToken = null;
  error;
  displayColumns;
  listView2 = null;
  contacts;

  @wire(getContacts)
  wiredContacts({ error, data }) {
      if (data) {
          this.contacts = data;
      } else if (error) {
          console.error(error);
      }
  }

  setListView2() {
    this.listView2 = this.listView;
    console.log('this.listView2', this.listView2);
  }
 
  @wire(getRecord, { recordId: '$recordId', fields: [MailingCity, MailingCountry, MailingPostalCode, MailingState, MailingStreet] })
  record;

  mapMarkers = [];
  handleSuccess() {
       // Close the modal window and display a success toast
       this.dispatchEvent(new CloseActionScreenEvent());
       this.dispatchEvent(
           new ShowToastEvent({
               title: 'Success',
               message: 'Record updated!',
               variant: 'success'
           })
       );
  }

  clickHandler1() {
    console.log('this.contacts', this.contacts);
    console.log('this.contacts[2].Id', this.contacts[2].Id);
    console.log('this.contacts[2].Name', this.contacts[2].Name);
    console.log('this.contacts[2].MailingCity', this.contacts[2].MailingCity);
    console.log('this.contacts[2].MailingCountry', this.contacts[2].MailingCountry);
    console.log('this.contacts[2].MailingPostalCode', this.contacts[2].MailingPostalCode);
    console.log('this.contacts[2].MailingState', this.contacts[2].MailingState);
    console.log('this.contacts[2].MailingStreet', this.contacts[2].MailingStreet);
    this.mapMarkers = [
      {
        location: {
          City: this.contacts[2].MailingCity == null ? ' ' : this.contacts[2].MailingCity,
          Country: this.contacts[2].MailingCountry == null ? ' ' : this.contacts[2].MailingCountry,
          PostalCode: this.contacts[2].MailingPostalCode == null ? ' ' : this.contacts[2].MailingPostalCode,
          State: this.contacts[2].MailingState == null ? ' ' : this.contacts[2].MailingState,
          Street: this.contacts[2].MailingStreet == null ? ' ' : this.contacts[2].MailingStreet
        },
        title: this.contacts[2].Name,
      }
    ]
    console.log('this.mapMarkers', this.mapMarkers);
    console.log('Finished!');
  }

  clickHandler2() {
    console.log(this.contacts);
    for (let i = 0; i < this.contacts.length; i++) {
      console.log('this.contacts', ...[this.contacts[i].MailingCity, this.contacts[i].MailingCountry, this.contacts[i].MailingPostalCode, this.contacts[i].MailingState, this.contacts[i].MailingStreet]);
      console.log('this.mapMarkers', ...this.mapMarkers);
      this.mapMarkers = [
        ...this.mapMarkers,
        {
          location: {
            City: this.contacts[i].MailingCity == null ? ' ' : this.contacts[i].MailingCity,
            Country: this.contacts[i].MailingCountry == null ? ' ' : this.contacts[i].MailingCountry,
            PostalCode: this.contacts[i].MailingPostalCode == null ? ' ' : this.contacts[i].MailingPostalCode,
            State: this.contacts[i].MailingState == null ? ' ' : this.contacts[i].MailingState,
            Street: this.contacts[i].MailingStreet == null ? ' ' : this.contacts[i].MailingStreet
          },
          title: this.contacts[i].Name,
        }
      ]
    }
  }
}
