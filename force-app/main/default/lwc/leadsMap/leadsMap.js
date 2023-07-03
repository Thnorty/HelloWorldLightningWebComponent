import { LightningElement, wire } from 'lwc';
import getLeads from '@salesforce/apex/LeadController.getLeads';

export default class LeadsMap extends LightningElement {
  error;
  leads;
  mapShape;
  mapMarkers = [];
  loaded = false;
  address = '';
  circleRadius = 0;
  nameFilter = '';
  emailFilter = '';
  titleFilter = '';
  leadSourceFilter = '';
  companyFilter = '';
  industryFilter = '';
  statusFilter = '';
  ratingFilter = '';
  
  // This method is wired to the getLeads Apex method.
  // It retrieves the leads data and sets it to the leads property.
  // If there is an error, it logs the error to the console.
  @wire(getLeads)
  wiredLeads({ error, data }) {
      if (data) {
          this.leads = data;
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
    for (let i = 0; i < this.leads.length; i++) {
      leadSourceSet.add(this.leads[i].LeadSource);
    }
    leadSourceSet.forEach(leadSource => {
      leadSourceOptions.push({label: leadSource, value: leadSource});
    });
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
    });
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
    });
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
      ratingOptions.push({label: rating, value: rating});
    });
    return ratingOptions;
  }

  handleAddressChange(event) {
    this.address = event.target.value;
  }

  handleUnitChange(event) {
    this.mileOrKm = event.target.value;
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
    this.companyFilter = '';
    this.industryFilter = '';
    this.statusFilter = '';
    this.ratingFilter = '';
  }
  // This method sets the map.
  handleSave() {
    this.mapMarkers = this.leads
    .filter(lead => (lead.Name && lead.Name.includes(this.nameFilter)) || (this.nameFilter === ''))
    .filter(lead => (lead.Email && lead.Email.includes(this.emailFilter)) || (this.emailFilter === ''))
    .filter(lead => (lead.Title && lead.Title.includes(this.titleFilter)) || (this.titleFilter === ''))
    .filter(lead => (lead.LeadSource && lead.LeadSource.includes(this.leadSourceFilter)) || (this.leadSourceFilter === ''))
    .filter(lead => (lead.Company && lead.Company.includes(this.companyFilter)) || (this.companyFilter === ''))
    .filter(lead => (lead.Industry && lead.Industry.includes(this.industryFilter)) || (this.industryFilter === ''))
    .filter(lead => (lead.Status && lead.Status.includes(this.statusFilter)) || (this.statusFilter === ''))
    .filter(lead => (lead.Rating && lead.Rating.includes(this.ratingFilter)) || (this.ratingFilter === ''))
    .map(lead => ({
      location: {
        City: lead.City || ' ',
        Country: lead.Country || ' ',
        PostalCode: lead.PostalCode || ' ',
        State: lead.State || ' ',
        Street: lead.Street || ' '
      },
      title: lead.Name,
      description: `${lead.Name ? `<b>Name:</b> ${lead.Name}<br/>` : ''}
                    ${lead.Email ? `<b>Email:</b> ${lead.Email}<br/>` : ''}
                    ${lead.Title ? `<b>Title:</b> ${lead.Title}<br/>` : ''}
                    ${lead.LeadSource ? `<b>Lead Source:</b> ${lead.LeadSource}<br/>` : ''}
                    ${lead.Company ? `<b>Company:</b> ${lead.Company}<br/>` : ''}
                    ${lead.Industry ? `<b>Industry:</b> ${lead.Industry}<br/>` : ''}
                    ${lead.Status ? `<b>Status:</b> ${lead.Status}<br/>` : ''}
                    ${lead.Rating ? `<b>Rating:</b> ${lead.Rating}<br/>` : ''}`,
      mapIcon : {
          path: 'M 125,5 155,90 245,90 175,145 200,230 125,180 50,230 75,145 5,90 95,90 z',
          fillColor: '#CF3476',
          fillOpacity: 0.5,
          strokeWeight: 1,
          scale: 0.10,
      }
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
}