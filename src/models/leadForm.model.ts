import mongoose, { Schema } from "mongoose";
import { LeadFormType } from "../types/leadForm.types";

const LeadSchema = new Schema<LeadFormType>(
  {
    header: { type: String, required: false },
    fields: [
      {
        fieldType: String,
        label: String,
        isEnabled: Boolean,
        isRequired: Boolean,
        placeholder: String,
        options: [{
          label: String,
          value: String
        }],
      } 
    ],
  },
  { timestamps: true }
);

const LeadForm = mongoose.model<LeadFormType>("LeadForm", LeadSchema);
export default LeadForm;