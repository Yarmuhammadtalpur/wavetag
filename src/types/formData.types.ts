import mongoose, { Document, ObjectId } from "mongoose";
import { FieldsTypes } from "./fields.types";

export type FormDataTypes = {
  leadForm: mongoose.Types.ObjectId;
  data: FieldsTypes[]; // Use the FormFieldsDocument interface here
  _id: ObjectId;
};
