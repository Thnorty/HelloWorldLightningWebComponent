import { LightningElement, track } from "lwc";

export default class ReactContactsMap extends LightningElement {
  @track width = "100%";
  @track height = "100%";
  @track referrerPolicy = "no-referrer";
  @track sandbox = "allow-scripts allow-same-origin";
  @track url = "https://thnorty.github.io/react-salesforce-map/";
}