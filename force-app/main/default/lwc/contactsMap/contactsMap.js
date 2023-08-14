import { LightningElement, wire, track } from "lwc";
import { refreshApex } from "@salesforce/apex";
import getContacts from "@salesforce/apex/ContactController.getContacts";
import ContactModal from "./contactModal";

export default class ContactsMap extends LightningElement {
  error;
  contacts;
  mapShape;
  @track mapMarkers = [];
  @track favoriteContacts = [];
  loaded = false;
  address = "";
  circleRadius = 0;
  nameFilter = "";
  emailFilter = "";
  titleFilter = "";
  leadSourceFilter = "";
  mileOrKm = "km";
  selectedMarkerValue = "";
  mapCenter = {
    City: "",
    Country: "",
    PostalCode: "",
    State: "",
    Street: ""
  };
  markerList;
  markerInfo;

  // This method is called when the component is rendered.
  renderedCallback() {
    if (this.loaded) {
      this.setHeights();
    }
  }

  // This method is wired to the getContacts Apex method.
  // It retrieves the contacts data and sets it to the contacts property.
  // If there is an error, it logs the error to the console.
  @wire(getContacts)
  wiredContacts(result) {
    this.wiredContactList = result;

    if (result.data) {
      this.contacts = result.data;
      this.loaded = true;
      this.handleFilterSave();
      this.handleAreaSave();
    } else if (result.error) {
      console.error(result.error);
    }
  }

  // This method is used to bring up the create contact modal.
  async handleOpenModal() {
    await ContactModal.open({
      size: "small"
    });
    await refreshApex(this.wiredContactList);

    this.handleFilterSave();
    this.handleAreaSave();
  }

  // This method is used to set the heights of the elements to match the height of the lightning-map component.
  setHeights() {
    // Get the lightning-map component and the other elements
    const map = this.template.querySelector("lightning-map");
    const info = this.template.querySelector(".info");
    const noItemPage = this.template.querySelector(".no-item-page");
    const list = this.template.querySelector(".list");
    const filterMenu = this.template.querySelector(".filter-menu");
    const areaMenu = this.template.querySelector(".area-menu");
    const favoriteContactsMenu = this.template.querySelector(
      ".favorite-contacts-menu"
    );

    // Set the initial heights of the other elements to match the height of the lightning-map component
    if (info) info.style.height = `${map.offsetHeight}px`;
    if (noItemPage) noItemPage.style.height = `${map.offsetHeight}px`;
    if (list) list.style.height = `${map.offsetHeight}px`;
    if (filterMenu) filterMenu.style.height = `${map.offsetHeight}px`;
    if (areaMenu) areaMenu.style.height = `${map.offsetHeight}px`;
    if (favoriteContactsMenu)
      favoriteContactsMenu.style.height = `${map.offsetHeight}px`;

    // Add an event listener to the window object to detect changes to the height of the lightning-map component
    window.addEventListener("resize", () => {
      // Update the heights of the other elements to match the new height of the lightning-map component
      if (info) info.style.height = `${map.offsetHeight}px`;
      if (noItemPage) noItemPage.style.height = `${map.offsetHeight}px`;
      if (list) list.style.height = `${map.offsetHeight}px`;
      if (filterMenu) filterMenu.style.height = `${map.offsetHeight}px`;
      if (areaMenu) areaMenu.style.height = `${map.offsetHeight}px`;
      if (favoriteContactsMenu)
        favoriteContactsMenu.style.height = `${map.offsetHeight}px`;
    });
  }

  // Unit options getter
  get unitOptions() {
    return [
      { label: "Km", value: "km" },
      { label: "Mi", value: "mi" }
    ];
  }
  // Lead Source options getter
  get leadSourceOptions() {
    let leadSourceOptions = [];
    let leadSourceSet = new Set();
    leadSourceSet.add(undefined);
    for (let i = 0; i < this.contacts.length; i++) {
      leadSourceSet.add(this.contacts[i].LeadSource);
    }
    leadSourceSet.forEach((leadSource) => {
      leadSourceOptions.push({ label: leadSource, value: leadSource });
    });
    return leadSourceOptions;
  }

  // On click function for the filter button
  menu1Button() {
    let filterMenu = this.template.querySelector(".filter-menu");
    let areaMenu = this.template.querySelector(".area-menu");
    let favoriteContactsMenu = this.template.querySelector(
      ".favorite-contacts-menu"
    );

    if (filterMenu.classList.contains("slds-hide")) {
      areaMenu.classList.add("slds-hide");
      favoriteContactsMenu.classList.add("slds-hide");
      filterMenu.classList.remove("slds-hide");
    } else {
      filterMenu.classList.add("slds-hide");
    }
  }
  // On click function for the area button
  menu2Button() {
    let filterMenu = this.template.querySelector(".filter-menu");
    let areaMenu = this.template.querySelector(".area-menu");
    let favoriteContactsMenu = this.template.querySelector(
      ".favorite-contacts-menu"
    );

    if (areaMenu.classList.contains("slds-hide")) {
      filterMenu.classList.add("slds-hide");
      favoriteContactsMenu.classList.add("slds-hide");
      areaMenu.classList.remove("slds-hide");
    } else {
      areaMenu.classList.add("slds-hide");
    }
  }
  // On click function for the favorite contacts button
  menu3Button() {
    let filterMenu = this.template.querySelector(".filter-menu");
    let areaMenu = this.template.querySelector(".area-menu");
    let favoriteContactsMenu = this.template.querySelector(
      ".favorite-contacts-menu"
    );

    if (favoriteContactsMenu.classList.contains("slds-hide")) {
      filterMenu.classList.add("slds-hide");
      areaMenu.classList.add("slds-hide");
      favoriteContactsMenu.classList.remove("slds-hide");
    } else {
      favoriteContactsMenu.classList.add("slds-hide");
    }
  }

  // On click function for closing the info window
  handleCloseInfo() {
    this.markerList = this.template.querySelector(".list");
    this.markerInfo = this.template.querySelector(".info");

    this.markerList.classList.remove("fade-out");
    this.markerInfo.classList.remove("fade-in");
    this.markerInfo.classList.add("slds-hide");

    this.selectedMarkerValue = "";
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
        };
        break;
      }
    }

    this.updateMarkerInfo(this.selectedMarkerValue);
  }

  // On click function for the list elements
  handleListElementClick(event) {
    const value = event.currentTarget.getAttribute("data-id");
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
        };
        break;
      }
    }

    this.updateMarkerInfo(this.selectedMarkerValue);
  }

  // On mouse enter function for the list elements
  handleListElementMouseEnter(event) {
    const value = event.currentTarget.getAttribute("data-id");
    const favoriteButtons = this.template.querySelectorAll(".favorite-button");

    for (let i = 0; i < favoriteButtons.length; i++) {
      if (favoriteButtons[i].getAttribute("data-id") === value) {
        favoriteButtons[i].classList.remove("slds-hide");
        break;
      }
    }
  }

  // On mouse leave function for the list elements
  handleListElementMouseLeave(event) {
    const value = event.currentTarget.getAttribute("data-id");
    const favoriteButtons = this.template.querySelectorAll(".favorite-button");

    for (let i = 0; i < favoriteButtons.length; i++) {
      if (
        favoriteButtons[i].getAttribute("data-id") === value &&
        favoriteButtons[i].iconName === "utility:favorite_alt"
      ) {
        favoriteButtons[i].classList.add("slds-hide");
        break;
      }
    }
  }

  // On click function for the favorite button
  handleFavoriteClick(event) {
    event.stopPropagation();

    const button = event.currentTarget;
    const value = button.getAttribute("data-id");
    const name = value.split(" - ")[0];
    const id = value.split(" - ")[3];

    if (button.iconName === "utility:favorite_alt") {
      this.favoriteContacts.push({ name: name, id: id });
    } else {
      this.favoriteContacts = this.favoriteContacts.filter(
        (contact) => contact.id !== id
      );
    }

    button.iconName =
      button.iconName === "utility:favorite"
        ? "utility:favorite_alt"
        : "utility:favorite";
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

  // This method clears the map markers and map shapes arrays.
  handleClearMarker() {
    this.address = "";
    this.circleRadius = 0;
    this.mapShape = undefined;
  }
  // This method clears the filters.
  handleClearFilters() {
    this.nameFilter = "";
    this.emailFilter = "";
    this.titleFilter = "";
    this.leadSourceFilter = "";
  }
  // This method applies the filters.
  handleFilterSave() {
    this.mapMarkers = this.contacts
      .filter(
        (contact) =>
          (contact.Name && contact.Name.includes(this.nameFilter)) ||
          this.nameFilter === ""
      )
      .filter(
        (contact) =>
          (contact.Email && contact.Email.includes(this.emailFilter)) ||
          this.emailFilter === ""
      )
      .filter(
        (contact) =>
          (contact.Title && contact.Title.includes(this.titleFilter)) ||
          this.titleFilter === ""
      )
      .filter(
        (contact) =>
          (contact.LeadSource &&
            contact.LeadSource.includes(this.leadSourceFilter)) ||
          this.leadSourceFilter === ""
      )
      .map((contact) => ({
        location: {
          City: contact.MailingCity || " ",
          Country: contact.MailingCountry || " ",
          PostalCode: contact.MailingPostalCode || " ",
          State: contact.MailingState || " ",
          Street: contact.MailingStreet || " "
        },
        value:
          contact.Name +
          " - " +
          contact.Email +
          " - " +
          contact.Phone +
          " - " +
          contact.Id,
        name: contact.Name,
        photoUrl: contact.PhotoUrl,
        mapIcon: {
          path: "M 125,5 155,90 245,90 175,145 200,230 125,180 50,230 75,145 5,90 95,90 z",
          fillColor: getRandomColor(),
          fillOpacity: 0.8,
          strokeColor: "#000000",
          strokeOpacity: 1,
          strokeWeight: 1,
          scale: 0.1
        }
      }));

    const noItemPage = this.template.querySelector(".no-item-page");
    if (noItemPage) {
      if (this.mapMarkers.length === 0) {
        noItemPage.classList.remove("slds-hide");
      } else {
        noItemPage.classList.add("slds-hide");
      }
    }
  }
  // This method applies the map shape.
  handleAreaSave() {
    if (this.circleRadius > 0) {
      this.mapShape = {
        location: {
          City: this.address,
          Country: " ",
          PostalCode: " ",
          State: " ",
          Street: " "
        },
        type: "Circle",
        radius:
          this.mileOrKm === "km"
            ? this.circleRadius * 1000
            : this.circleRadius * 1609.34,
        fillColor: "#FFF000",
        fillOpacity: 0.35,
        strokeColor: "#FFF000",
        strokeOpacity: 0.8,
        strokeWeight: 2
      };
    }

    if (this.mapShape) {
      this.mapMarkers.push(this.mapShape);
    }
  }

  // This method updates the marker info
  updateMarkerInfo(infoText) {
    const markerInfoName = this.template.querySelector(".marker-info-name");
    const markerInfoEmail = this.template.querySelector(".marker-info-email");
    const markerInfoPhone = this.template.querySelector(".marker-info-phone");
    const infoIconPhoto = this.template.querySelector(".info-icon-photo");
    const infoIconSvg = this.template.querySelector(".info-icon-circle");

    markerInfoName.textContent = infoText.split(" - ")[0];
    markerInfoEmail.textContent = infoText.split(" - ")[1];
    markerInfoPhone.textContent = infoText.split(" - ")[2];

    for (let i = 0; i < this.mapMarkers.length; i++) {
      if (this.mapMarkers[i].value === infoText) {
        infoIconPhoto.src = this.mapMarkers[i].photoUrl;
        infoIconSvg.style.stroke = this.mapMarkers[i].mapIcon.fillColor;
      }
    }

    this.markerList = this.template.querySelector(".list");
    this.markerInfo = this.template.querySelector(".info");

    this.markerList.classList.add("fade-out");
    this.markerInfo.classList.remove("slds-hide");
    this.markerInfo.classList.add("fade-in");
  }
}

// This method generates a random color.
function getRandomColor() {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgb(${r}, ${g}, ${b})`;
}