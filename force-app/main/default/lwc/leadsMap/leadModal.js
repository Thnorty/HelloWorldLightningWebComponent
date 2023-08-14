import { api } from "lwc";
import LightningModal from "lightning/modal";
import { ShowToastEvent } from "lightning/platformShowToastEvent";

export default class LeadModal extends LightningModal {
  @api recordId;
  fields = ["Name", "Phone", "Email", "Address", "Description"];

  handleSuccess() {
    const evt = new ShowToastEvent({
      title: "Lead was created",
      variant: "success"
    });
    this.dispatchEvent(evt);
  }

  handleCancel() {
    this.close();
  }
}