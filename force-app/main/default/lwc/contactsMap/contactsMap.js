import { LightningElement, wire } from 'lwc';
import getContacts from '@salesforce/apex/ContactController.getContacts';

export default class ContactsMap extends LightningElement {
  error;
  contacts;
  mapMarkers = [];
  mapShapes = [];
  loaded = false;
  address = "";
  shape = "";
  circle = false;
  rectangle = false;
  circleRadius = 0;
  rectangleNorth = 0;
  rectangleSouth = 0;
  rectangleEast = 0;
  rectangleWest = 0;
  nameFilter;
  emailFilter;
  phoneFilter;
  mobilePhoneFilter;
  titleFilter;
  leadSourceFilter;
  
  // This method is wired to the getContacts Apex method.
  // It retrieves the contacts data and sets it to the contacts property.
  // If there is an error, it logs the error to the console.
  @wire(getContacts)
  wiredContacts({ error, data }) {
      if (data) {
          this.contacts = data;
          this.handleSave();
          this.loaded = true;
      } else if (error) {
          console.error(error);
      }
  }

  get shapeOptions() {
    return [
      { label: 'Circle', value: 'Circle' },
      { label: 'Rectangle', value: 'Rectangle' },
    ]
  }

  handleAddressChange(event) {
    this.address = event.target.value;
  }

  handleShapeChange(event) {
    this.shape = event.target.value;
    if (this.shape === 'Circle') {
      this.circle = true;
      this.rectangle = false;
    }
    else if (this.shape === 'Rectangle') {
      this.circle = false;
      this.rectangle = true;
    }
  }

  handleCircleRadiusChange(event) {
    this.circleRadius = Number(event.target.value);
  }

  handleRectangleNorthChange(event) {
    this.rectangleNorth = Number(event.target.value);
  }

  handleRectangleSouthChange(event) {
    this.rectangleSouth = Number(event.target.value);
  }

  handleRectangleEastChange(event) {
    this.rectangleEast = Number(event.target.value);
  }

  handleRectangleWestChange(event) {
    this.rectangleWest = Number(event.target.value);
  }

  handleNameFilterChange(event) {
    this.nameFilter = event.target.value;
  }

  handleEmailFilterChange(event) {
    this.emailFilter = event.target.value;
  }

  handlePhoneFilterChange(event) {
    this.phoneFilter = event.target.value;
  }

  handleMobilePhoneFilterChange(event) {
    this.mobilePhoneFilter = event.target.value;
  }

  handleTitleFilterChange(event) {
    this.titleFilter = event.target.value;
  }

  handleLeadSourceFilterChange(event) {
    this.leadSourceFilter = event.target.value;
  }

  // This method clears the map markers and map shapes arrays.
  handleClearMarker() {
    this.shape = "";
    this.circle = false;
    this.rectangle = false;
    this.address = "";
    this.circleRadius = 0;
    this.rectangleNorth = 0;
    this.rectangleSouth = 0;
    this.rectangleEast = 0;
    this.rectangleWest = 0;
    this.mapShapes = [];
  }
  // This method clears the filters.
  handleClearFilters() {
    this.nameFilter = '';
    this.emailFilter = '';
    this.phoneFilter = '';
    this.mobilePhoneFilter = '';
    this.titleFilter = '';
    this.leadSourceFilter = '';
  }
  // This method sets the map.
  handleSave() {
    this.mapMarkers = this.contacts.map(contact => ({
      location: {
        City: contact.MailingCity || ' ',
        Country: contact.MailingCountry || ' ',
        PostalCode: contact.MailingPostalCode || ' ',
        State: contact.MailingState || ' ',
        Street: contact.MailingStreet || ' '
      },
      title: contact.Name,
      description: `<b>Name:</b> ${contact.Name}<br/>
                    <b>Email:</b> ${contact.Email}<br/>
                    <b>Phone:</b> ${contact.Phone}<br/>
                    <b>Mobile Phone:</b> ${contact.MobilePhone}<br/>
                    <b>Title:</b> ${contact.Title}<br/>
                    <b>Lead Source:</b> ${contact.LeadSource}`
    }));

    if (this.nameFilter) {
      this.mapMarkers = this.mapMarkers.filter(marker => marker.title.includes(this.nameFilter));
    }
    if (this.emailFilter) {
      this.mapMarkers = this.mapMarkers.filter(marker => marker.description.includes(this.emailFilter));
    }
    if (this.phoneFilter) {
      this.mapMarkers = this.mapMarkers.filter(marker => marker.description.includes(this.phoneFilter));
    }
    if (this.mobilePhoneFilter) {
      this.mapMarkers = this.mapMarkers.filter(marker => marker.description.includes(this.mobilePhoneFilter));
    }
    if (this.titleFilter) {
      this.mapMarkers = this.mapMarkers.filter(marker => marker.description.includes(this.titleFilter));
    }
    if (this.leadSourceFilter) {
      this.mapMarkers = this.mapMarkers.filter(marker => marker.description.includes(this.leadSourceFilter));
    }
    
    if (this.shape.length > 0) {
      if (this.circle) {
        this.mapShapes = [
          {
            location: {
              City: this.address,
              Country: ' ',
              PostalCode: ' ',
              State: ' ',
              Street: ' '
            },
            type: 'Circle',
            radius: this.circleRadius,
            strokeColor: '#FFF000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FFF000',
            fillOpacity: 0.35,
          }
        ];
      }
      else if (this.rectangle) {
        this.mapShapes = [
          {
            location: {
              Latitude: '0',
              Longitude: '0',
            },
            type: 'Rectangle',
            bounds: {
              north: this.rectangleNorth,
              south: this.rectangleSouth,
              east: this.rectangleEast,
              west: this.rectangleWest
            },
            strokeColor: '#FFF000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FFF000',
            fillOpacity: 0.35,
          }
        ];
      }
    }
    this.mapMarkers = [...this.mapMarkers, ...this.mapShapes];
  }
}