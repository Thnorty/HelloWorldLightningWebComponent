import { LightningElement, wire } from 'lwc';
import getLeads from '@salesforce/apex/LeadController.getLeads';

export default class LeadsMap extends LightningElement {
  error;
  leads;
  mapMarkers = [];
  loaded = false;
  
  // This method is wired to the getLeads Apex method.
  // It retrieves the leads data and sets it to the leads property.
  // If there is an error, it logs the error to the console.
  @wire(getLeads)
  wiredLeads({ error, data }) {
      if (data) {
          this.leads = data;
          this.setMapForEveryLead();
          this.loaded = true;
      } else if (error) {
          console.error(error);
      }
  }

  // This method sets the map markers for every lead in the leads array.
  setMapForEveryLead() {
    this.mapMarkers = this.leads.map(lead => ({
      location: {
        City: lead.City || ' ',
        Country: lead.Country || ' ',
        PostalCode: lead.PostalCode || ' ',
        State: lead.State || ' ',
        Street: lead.Street || ' '
      },
      title: lead.Name
    }));
  }
}