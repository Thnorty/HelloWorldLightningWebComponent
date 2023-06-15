import { LightningElement, wire } from 'lwc';
import getLeads from '@salesforce/apex/LeadController.getLeads';

export default class LeadsMap extends LightningElement {
  error;
  leads;
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
  companyFilter;
  industryFilter;
  statusFilter;
  ratingFilter;
  
  // This method is wired to the getLeads Apex method.
  // It retrieves the leads data and sets it to the leads property.
  // If there is an error, it logs the error to the console.
  @wire(getLeads)
  wiredLeads({ error, data }) {
      if (data) {
          this.leads = data;
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
  get leadSourceOptions() {
    let leadSourceOptions = [];
    let leadSourceSet = new Set();
    leadSourceSet.add(undefined);
    for (let i = 0; i < this.leads.length; i++) {
      leadSourceSet.add(this.leads[i].LeadSource);
    }
    leadSourceSet.forEach(leadSource => {
      leadSourceOptions.push({label: leadSource, value: leadSource});
    }
    );
    return leadSourceOptions;
  }
  get industryOptions() {
    let industryOptions = [];
    let industrySet = new Set();
    industrySet.add(undefined);
    for (let i = 0; i < this.leads.length; i++) {
      industrySet.add(this.leads[i].Industry);
    }
    industrySet.forEach(industry => {
      industryOptions.push({label: industry, value: industry});
    }
    );
    return industryOptions;
  }      
  get statusOptions() {
    let statusOptions = [];
    let statusSet = new Set();
    statusSet.add(undefined);
    for (let i = 0; i < this.leads.length; i++) {
      statusSet.add(this.leads[i].Status);
    }
    statusSet.forEach(status => {
      statusOptions.push({label: status, value: status});
    }
    );
    return statusOptions;
  }
  get ratingOptions() {
    let ratingOptions = [];
    let ratingSet = new Set();
    ratingSet.add(undefined);
    for (let i = 0; i < this.leads.length; i++) {
      ratingSet.add(this.leads[i].Rating);
    }
    ratingSet.forEach(rating => {
      console.log(rating);
      ratingOptions.push({label: rating, value: rating});
    }
    );
    return ratingOptions;
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

  handleCompanyFilterChange(event) {
    this.companyFilter = event.target.value;
  }

  handleIndustryFilterChange(event) {
    this.industryFilter = event.target.value;
  }

  handleStatusFilterChange(event) {
    this.statusFilter = event.target.value;
  }

  handleRatingFilterChange(event) {
    this.ratingFilter = event.target.value;
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
    this.companyFilter = '';
    this.industryFilter = '';
    this.statusFilter = '';
    this.ratingFilter = '';
  }
  // This method sets the map.
  handleSave() {
    this.mapMarkers = this.leads.map(lead => ({
      location: {
        City: lead.City || ' ',
        Country: lead.Country || ' ',
        PostalCode: lead.PostalCode || ' ',
        State: lead.State || ' ',
        Street: lead.Street || ' '
      },
      title: lead.Name,
      description: `<b>Name:</b> ${lead.Name}<br/>
                    <b>Email:</b> ${lead.Email}<br/>
                    <b>Phone:</b> ${lead.Phone}<br/>
                    <b>Mobile Phone:</b> ${lead.MobilePhone}<br/>
                    <b>Title:</b> ${lead.Title}<br/>
                    <b>Lead Source:</b> ${lead.LeadSource}<br/>
                    <b>Company:</b> ${lead.Company}<br/>
                    <b>Industry:</b> ${lead.Industry}<br/>
                    <b>Status:</b> ${lead.Status}<br/>
                    <b>Rating:</b> ${lead.Rating}`
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
    if (this.companyFilter) {
      this.mapMarkers = this.mapMarkers.filter(marker => marker.description.includes(this.companyFilter));
    }
    if (this.industryFilter) {
      this.mapMarkers = this.mapMarkers.filter(marker => marker.description.includes(this.industryFilter));
    }
    if (this.statusFilter) {
      this.mapMarkers = this.mapMarkers.filter(marker => marker.description.includes(this.statusFilter));
    }
    if (this.ratingFilter) {
      this.mapMarkers = this.mapMarkers.filter(marker => marker.description.includes(this.ratingFilter));
    }
    
    if (this.shape.length > 0) {
      this.mapShapes = [
        {
          location: {
            City: this.address,
            Country: ' ',
            PostalCode: ' ',
            State: ' ',
            Street: ' '
          },
          type: this.circle ? 'Circle' : 'Rectangle',
          bounds: {
            north: this.rectangleNorth,
            south: this.rectangleSouth,
            east: this.rectangleEast,
            west: this.rectangleWest
          },
          radius: this.circleRadius,
          strokeColor: '#FFF000',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#FFF000',
          fillOpacity: 0.35,
        }
      ];
    }
    
    this.mapMarkers = [...this.mapMarkers, ...this.mapShapes];
  }
}