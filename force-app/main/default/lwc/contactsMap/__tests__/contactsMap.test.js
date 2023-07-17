import { createElement } from "lwc";
import ContactsMap from "c/contactsMap";
import getContacts from "@salesforce/apex/ContactController.getContacts";

// Realistic data with a list of contacts
const mockAccountList = require("./data/accountList.json");

jest.mock(
  "@salesforce/apex/ContactController.getContacts",
  () => {
    const { createApexTestWireAdapter } = require("@salesforce/sfdx-lwc-jest");
    return {
      default: createApexTestWireAdapter(jest.fn())
    };
  },
  { virtual: true }
);

describe("c-contacts-map", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
    // Prevent data saved on mocks from leaking between tests
    jest.clearAllMocks();
  });

  it("checks if site is loaded", () => {
    const element = createElement("c-contacts-map", {
      is: ContactsMap
    });
    document.body.appendChild(element);

    // Emit data from @wire
    getContacts.emit(mockAccountList);

    return Promise.resolve().then(() => {
      const map = element.shadowRoot.querySelector("lightning-map");
      expect(map).not.toBeNull();
    });
  });

  it("checks if it renders the list of contacts", () => {
    const element = createElement("c-contacts-map", {
      is: ContactsMap
    });

    document.body.appendChild(element);

    // Emit data from @wire
    getContacts.emit(mockAccountList);

    return Promise.resolve().then(() => {
      // Select elements for validation
      const list = element.shadowRoot.querySelector(".list");
      expect(list).not.toBeNull();

      // Select all the list items for validation
      const listItems = element.shadowRoot.querySelectorAll(".list-element");
      expect(listItems.length).toBe(mockAccountList.length);
    });
  });

  it("checks if it renders the side menus", () => {
    const element = createElement("c-contacts-map", {
      is: ContactsMap
    });
    document.body.appendChild(element);

    // Emit data from @wire
    getContacts.emit(mockAccountList);

    return Promise.resolve().then(() => {
      // Select all the side buttons
      const buttons = element.shadowRoot.querySelectorAll(
        "lightning-button-icon"
      );

      // Click on the first button to open the filter menu
      buttons[0].click();
      // try to find text 'Filters (Case Sensitive)' in the shadow root
      const filters = element.shadowRoot.querySelector(".filter-menu");
      expect(filters.classList).not.toContain("hide");

      // Click on the second button to open the area menu
      buttons[1].click();
      // try to find text 'Circle Area' in the shadow root
      const area = element.shadowRoot.querySelector(".area-menu");
      expect(area.classList).not.toContain("hide");

      // Check if the first menu is closed
      const filterMenu = element.shadowRoot.querySelector(".filter-menu");
      expect(filterMenu.classList).toContain("hide");
    });
  });
});
