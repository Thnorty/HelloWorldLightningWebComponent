import { api } from "lwc";
import LightningModal from "lightning/modal";
import { ShowToastEvent } from "lightning/platformShowToastEvent";

export default class ContactModal extends LightningModal {
  @api recordId;
  fields = ["Name", "Phone", "Email", "MailingAddress", "Description"];

  handleSuccess() {
    const evt = new ShowToastEvent({
      title: "Contact was created",
      variant: "success"
    });
    this.dispatchEvent(evt);
  }

  handleCancel() {
    this.close();
  }
}