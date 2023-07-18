import { createElement } from "lwc";
import LeadsMap from "c/leadsMap";
import getLeads from "@salesforce/apex/LeadController.getLeads";

// Realistic data with a list of leads
const mockLeadList = require("./data/leadList.json");

jest.mock(
  "@salesforce/apex/LeadController.getLeads",
  () => {
    const { createApexTestWireAdapter } = require("@salesforce/sfdx-lwc-jest");
    return {
      default: createApexTestWireAdapter(jest.fn())
    };
  },
  { virtual: true }
);

describe("c-leads-map", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
    // Prevent data saved on mocks from leaking between tests
    jest.clearAllMocks();
  });

  it("checks if site is loaded", () => {
    const element = createElement("c-leads-map", {
      is: LeadsMap
    });
    document.body.appendChild(element);

    // Emit data from @wire
    getLeads.emit(mockLeadList);

    return Promise.resolve().then(() => {
      const map = element.shadowRoot.querySelector("lightning-map");
      expect(map).not.toBeNull();
    });
  });

  it("checks if it renders the list of leads", () => {
    const element = createElement("c-leads-map", {
      is: LeadsMap
    });

    document.body.appendChild(element);

    // Emit data from @wire
    getLeads.emit(mockLeadList);

    return Promise.resolve().then(() => {
      // Select elements for validation
      const list = element.shadowRoot.querySelector(".list");
      expect(list).not.toBeNull();

      // Select all the list items for validation
      const listItems = element.shadowRoot.querySelectorAll(".list-element");
      expect(listItems.length).toBe(mockLeadList.length);
    });
  });

  it("checks if it renders the side menus", () => {
    const element = createElement("c-leads-map", {
      is: LeadsMap
    });
    document.body.appendChild(element);

    // Emit data from @wire
    getLeads.emit(mockLeadList);

    return Promise.resolve().then(() => {
      // Select all the side buttons
      const buttons = element.shadowRoot.querySelectorAll(
        "lightning-button-icon"
      );

      // Click on the first button to open the filter menu
      buttons[0].click();
      // try to find text 'Filters (Case Sensitive)' in the shadow root
      const filters = element.shadowRoot.querySelector(".filter-menu");
      expect(filters.classList).not.toContain("slds-hide");

      // Click on the second button to open the area menu
      buttons[1].click();
      // try to find text 'Circle Area' in the shadow root
      const area = element.shadowRoot.querySelector(".area-menu");
      expect(area.classList).not.toContain("slds-hide");

      // Check if the first menu is closed
      const filterMenu = element.shadowRoot.querySelector(".filter-menu");
      expect(filterMenu.classList).toContain("slds-hide");
    });
  });
});
