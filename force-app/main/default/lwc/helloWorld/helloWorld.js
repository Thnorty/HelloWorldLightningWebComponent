import { LightningElement, wire } from 'lwc';
import getContacts from '@salesforce/apex/ContactController.getContacts';

export default class QuickEditFormExample extends LightningElement {
  error;
  contacts;
  hasRendered;
  mapMarkers = [];
  
  // This method is wired to the getContacts Apex method.
  // It retrieves the contacts data and sets it to the contacts property.
  // If there is an error, it logs the error to the console.
  @wire(getContacts)
  wiredContacts({ error, data }) {
      if (data) {
          this.contacts = data;
          this.setMapForEveryContact();
      } else if (error) {
          console.error(error);
      }
  }

  // This method sets the map markers for every contact in the contacts array.
  setMapForEveryContact() {
    this.mapMarkers = this.contacts.map(contact => ({
      location: {
        City: contact.MailingCity || ' ',
        Country: contact.MailingCountry || ' ',
        PostalCode: contact.MailingPostalCode || ' ',
        State: contact.MailingState || ' ',
        Street: contact.MailingStreet || ' '
      },
      title: contact.Name
    }));
  }
}
