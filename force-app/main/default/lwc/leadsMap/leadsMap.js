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
  mileOrKm = 'km';
  selectedMarkerValue = '';
  mapCenter = {
    City: '',
    Country: '',
    PostalCode: '',
    State: '',
    Street: ''
  };
  markerList;
  markerInfo;
  
  // This method is called when the component is rendered.
  renderedCallback() {
    if (this.loaded) {
      this.setHeights();
    }
  }

  // This method is wired to the getLeads Apex method.
  // It retrieves the leads data and sets it to the leads property.
  // If there is an error, it logs the error to the console.
  @wire(getLeads)
  wiredLeads({ error, data }) {
      if (data) {
          this.leads = data;
          this.handleFilterSave();
          this.handleAreaSave();
          this.loaded = true;
      } else if (error) {
          console.error(error);
      }
  }

  // This method is used to set the heights of the elements to match the height of the lightning-map component.
  setHeights() {
    // Get the lightning-map component and the other elements
    const map = this.template.querySelector('lightning-map');
    const info = this.template.querySelector('.info');
    const list = this.template.querySelector('.list');
    const filterMenu = this.template.querySelector('.filter-menu');
    const areaMenu = this.template.querySelector('.area-menu');

    // Set the initial heights of the other elements to match the height of the lightning-map component
    if (info) info.style.height = `${map.offsetHeight}px`;
    if (list) list.style.height = `${map.offsetHeight}px`;
    if (filterMenu) filterMenu.style.height = `${map.offsetHeight}px`;
    if (areaMenu) areaMenu.style.height = `${map.offsetHeight}px`;

    // Add an event listener to the window object to detect changes to the height of the lightning-map component
    window.addEventListener('resize', () => {
        // Update the heights of the other elements to match the new height of the lightning-map component
        if (info) info.style.height = `${map.offsetHeight}px`;
        if (list) list.style.height = `${map.offsetHeight}px`;
        if (filterMenu) filterMenu.style.height = `${map.offsetHeight}px`;
        if (areaMenu) areaMenu.style.height = `${map.offsetHeight}px`;
    });
  }

  // Unit options getter
  get unitOptions() {
    return [
      { label: 'Km', value: 'km' },
      { label: 'Miles', value: 'mi' }
    ]
  }
  // Lead Source options getter
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
  // Industry options getter
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
  // Status options getter    
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
  // Rating options getter
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

  // On click function for the filter button
  menu1Button() {
    let areaMenu = this.template.querySelector('.area-menu');
    let filterMenu = this.template.querySelector('.filter-menu');

    if (filterMenu.classList.contains('slds-hide')) {
      areaMenu.classList.add('slds-hide');
      filterMenu.classList.remove('slds-hide');
    } else {
      filterMenu.classList.add('slds-hide');
    }
  }
  // On click function for the area button
  menu2Button() {
    let areaMenu = this.template.querySelector('.area-menu');
    let filterMenu = this.template.querySelector('.filter-menu');

    if (areaMenu.classList.contains('slds-hide')) {
      filterMenu.classList.add('slds-hide');
      areaMenu.classList.remove('slds-hide');
    } else {
      areaMenu.classList.add('slds-hide');
    }
  }

  // On click function for closing the info window
  handleCloseInfo() {
    this.markerList = this.template.querySelector('.list');
    this.markerInfo = this.template.querySelector('.info');

    this.markerList.classList.remove('fade-out');
    this.markerInfo.classList.remove('fade-in');
    this.markerInfo.classList.add('slds-hide');
    
    this.selectedMarkerValue = '';
  }

  // On click function for the map markers
  handleMarkerSelect(event) {
    this.selectedMarkerValue = event.target.selectedMarkerValue;
    
    for (let i = 0; i < this.mapMarkers.length; i++) {
      if (this.mapMarkers[i].value === this.selectedMarkerValue) {
        this.mapCenter = {
          location: {
            City: this.mapMarkers[i].location.City,
            Country: this.mapMarkers[i].location.Country,
            PostalCode: this.mapMarkers[i].location.PostalCode,
            State: this.mapMarkers[i].location.State,
            Street: this.mapMarkers[i].location.Street
          }
        }
        break;
      }
    }

    this.updateMarkerInfo(this.selectedMarkerValue);
  }
  
  // On click function for the list elements
  handleListElementClick(event) {
    const value = event.currentTarget.getAttribute('data-id');
    this.selectedMarkerValue = value;
    
    for (let i = 0; i < this.mapMarkers.length; i++) {
      if (this.mapMarkers[i].value === this.selectedMarkerValue) {
        this.mapCenter = {
          location: {
            City: this.mapMarkers[i].location.City,
            Country: this.mapMarkers[i].location.Country,
            PostalCode: this.mapMarkers[i].location.PostalCode,
            State: this.mapMarkers[i].location.State,
            Street: this.mapMarkers[i].location.Street
          }
        }
        break;
      }
    }

    this.updateMarkerInfo(this.selectedMarkerValue);
  }
  // These methods are for updating values
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
  // This method applies the filters.
  handleFilterSave() {
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
      value: lead.Name + ' - ' + lead.Email + " - " + lead.Phone,
      name: lead.Name,
      mapIcon : {
          path: 'M 125,5 155,90 245,90 175,145 200,230 125,180 50,230 75,145 5,90 95,90 z',
          fillColor: getRandomColor(),
          fillOpacity: 0.8,
          strokeColor: '#000000',
          strokeOpacity: 1,
          strokeWeight: 1,
          scale: 0.10
      },
      id: lead.Id
    }));
  }
  // This method applies the map shape.
  handleAreaSave() {
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
        fillColor: '#FFF000',
        fillOpacity: 0.35,
        strokeColor: '#FFF000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
      }
    }

    if (this.mapShape) {
      this.mapMarkers.push(this.mapShape);
    }
  }

  // This method updates the marker info
  updateMarkerInfo(infoText) {
    const markerInfoName = this.template.querySelector('.marker-info-name');
    const markerInfoEmail = this.template.querySelector('.marker-info-email');
    const markerInfoPhone = this.template.querySelector('.marker-info-phone');
    const markerIconPath = this.template.querySelector('.marker-icon-path');

    markerInfoName.textContent = infoText.split(' - ')[0];
    markerInfoEmail.textContent = infoText.split(' - ')[1];
    markerInfoPhone.textContent = infoText.split(' - ')[2];
    
    for (let i = 0; i < this.mapMarkers.length; i++) {
      if (this.mapMarkers[i].value === infoText) {
        markerIconPath.setAttribute('d', this.mapMarkers[i].mapIcon.path);
        markerIconPath.setAttribute('fill', this.mapMarkers[i].mapIcon.fillColor);
        markerIconPath.setAttribute('fill-opacity', this.mapMarkers[i].mapIcon.fillOpacity);
        markerIconPath.setAttribute('stroke', this.mapMarkers[i].mapIcon.strokeColor);
        markerIconPath.setAttribute('stroke-opacity', this.mapMarkers[i].mapIcon.strokeOpacity);
        markerIconPath.setAttribute('stroke-width', this.mapMarkers[i].mapIcon.strokeWeight);
        markerIconPath.setAttribute('transform', 'scale(0.8)');
        break;
      }
    }

    this.markerList = this.template.querySelector('.list');
    this.markerInfo = this.template.querySelector('.info');

    this.markerList.classList.add('fade-out');
    this.markerInfo.classList.remove('slds-hide');
    this.markerInfo.classList.add('fade-in');
  }
}

// This method generates a random color.
function getRandomColor() {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgb(${r}, ${g}, ${b})`;
}