import { LightningElement, wire } from 'lwc';
import getContacts from '@salesforce/apex/ContactController.getContacts';

export default class ContactsMap extends LightningElement {
  error;
  contacts;
  mapShape;
  mapMarkers = [];
  loaded = false;
  address = "";
  circleRadius = 0;
  nameFilter = '';
  emailFilter = '';
  titleFilter = '';
  leadSourceFilter = '';
  mileOrKm = 'km';
  selectedMarkerValue = '';
  markerList;
  markerInfo;
  
  // This method is wired to the getContacts Apex method.
  // It retrieves the contacts data and sets it to the contacts property.
  // If there is an error, it logs the error to the console.
  @wire(getContacts)
  wiredContacts({ error, data }) {
      if (data) {
          this.contacts = data;
          this.handleSave();
      } else if (error) {
          console.error(error);
      }
  }
  
  get unitOptions() {
    return [
      { label: 'Km', value: 'km' },
      { label: 'Miles', value: 'mi' }
    ]
  }
  get leadSourceOptions() {
    let leadSourceOptions = [];
    let leadSourceSet = new Set();
    leadSourceSet.add(undefined);
    for (let i = 0; i < this.contacts.length; i++) {
      leadSourceSet.add(this.contacts[i].LeadSource);
    }
    leadSourceSet.forEach(leadSource => {
      leadSourceOptions.push({label: leadSource, value: leadSource});
    });
    return leadSourceOptions;
  }

  handleCloseInfo() {
    this.markerList = this.template.querySelector('.list');
    this.markerInfo = this.template.querySelector('.info');

    this.markerList.classList.remove('fade-out');
    this.markerInfo.classList.remove('fade-in');
    this.markerInfo.classList.add('hide');
  }

  handleMarkerSelect(event) {
    // TODO: Scroll into view

    this.selectedMarkerValue = event.target.selectedMarkerValue;
    this.updateMarkerInfo(this.selectedMarkerValue);
  }
  
  handleListElementClick(event) {
    const value = event.currentTarget.getAttribute('data-id');
    this.selectedMarkerValue = value;
    this.updateMarkerInfo(this.selectedMarkerValue);
  }
  
  handleUnitChange(event) {
    this.mileOrKm = event.target.value;
  }

  handleAddressChange(event) {
    this.address = event.target.value;
  }

  handleCircleRadiusChange(event) {
    this.circleRadius = Number(event.target.value);
  }

  handleNameFilterChange(event) {
    this.nameFilter = event.target.value;
  }

  handleEmailFilterChange(event) {
    this.emailFilter = event.target.value;
  }

  handleTitleFilterChange(event) {
    this.titleFilter = event.target.value;
  }

  handleLeadSourceFilterChange(event) {
    this.leadSourceFilter = event.target.value;
  }

  // This method clears the map markers and map shapes arrays.
  handleClearMarker() {
    this.address = "";
    this.circleRadius = 0;
    this.mapShape = undefined;
  }
  // This method clears the filters.
  handleClearFilters() {
    this.nameFilter = '';
    this.emailFilter = '';
    this.titleFilter = '';
    this.leadSourceFilter = '';
  }
  // This method sets the map.
  handleSave() {
    this.mapMarkers = this.contacts
      .filter(contact => (contact.Name && contact.Name.includes(this.nameFilter)) || (this.nameFilter === ''))
      .filter(contact => (contact.Email && contact.Email.includes(this.emailFilter)) || (this.emailFilter === ''))
      .filter(contact => (contact.Title && contact.Title.includes(this.titleFilter)) || (this.titleFilter === ''))
      .filter(contact => (contact.LeadSource && contact.LeadSource.includes(this.leadSourceFilter)) || (this.leadSourceFilter === ''))
      .map(contact => ({
        location: {
          City: contact.MailingCity || ' ',
          Country: contact.MailingCountry || ' ',
          PostalCode: contact.MailingPostalCode || ' ',
          State: contact.MailingState || ' ',
          Street: contact.MailingStreet || ' '
        },
        value: contact.Name + ' - ' + contact.Email + " - " + contact.Phone,
        name: contact.Name,
        mapIcon : {
            path: 'M 125,5 155,90 245,90 175,145 200,230 125,180 50,230 75,145 5,90 95,90 z M50,10 a 40,40 0 1,1 0,80 a 40,40 0 1,1 0,-80',
            fillColor: '#CF3476',
            fillOpacity: 1,
            strokeWeight: 1,
            scale: 0.10,
            anchor: {x: 122.5, y: 115}
        },
        id: contact.Id
      }));
    
    if (this.circleRadius > 0) {
      this.mapShape = {
        location: {
          City: this.address,
          Country: ' ',
          PostalCode: ' ',
          State: ' ',
          Street: ' '
        },
        type: 'Circle',
        radius: this.mileOrKm === 'km' ? this.circleRadius * 1000 : this.circleRadius * 1609.34,
        strokeColor: '#FFF000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FFF000',
        fillOpacity: 0.35,
      }
    }

    if (this.mapShape) {
      this.mapMarkers.push(this.mapShape);
    }
    
    this.loaded = true;
  }

  updateMarkerInfo(infoText) {
    const markerInfo = this.template.querySelector('.marker-info');
    markerInfo.textContent = infoText;
    
    this.markerList = this.template.querySelector('.list');
    this.markerInfo = this.template.querySelector('.info');

    this.markerList.classList.add('fade-out');
    this.markerInfo.classList.remove('hide');
    this.markerInfo.classList.add('fade-in');
  }
}