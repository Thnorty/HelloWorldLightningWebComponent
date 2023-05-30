import { LightningElement, wire } from 'lwc';
import getContacts from '@salesforce/apex/ContactController.getContacts';

export default class QuickEditFormExample extends LightningElement {
  error;
  contacts;
  hasRendered;
  mapMarkers = [];

  // This method is called after the component is rendered.
  // It sets a timer to check if the contacts data has been loaded.
  // Once the data is loaded, it calls the setMapForEveryContact method.
  renderedCallback() {
    if (this.hasRendered) {
      return;
    }
    this.hasRendered = true;
    
    // eslint-disable-next-line @lwc/lwc/no-async-operation
    const intervalId = setInterval(() => {
      if (this.contacts) {
        clearInterval(intervalId);
        this.setMapForEveryContact();
      }
    }, 100);
  }
  
  // This method is wired to the getContacts Apex method.
  // It retrieves the contacts data and sets it to the contacts property.
  // If there is an error, it logs the error to the console.
  @wire(getContacts)
  wiredContacts({ error, data }) {
      if (data) {
          this.contacts = data;
      } else if (error) {
          console.error(error);
      }
  }

  // This method sets the map markers for the third contact in the contacts array.
  setMapForThirdContact() {
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
  }

  // This method sets the map markers for every contact in the contacts array.
  setMapForEveryContact() {
    for (let i = 0; i < this.contacts.length; i++) {
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
