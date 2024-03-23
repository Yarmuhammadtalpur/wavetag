import mongoose, { ObjectId } from "mongoose"

export type FieldsTypes = {
  label: string,
  fieldId: mongoose.Schema.Types.ObjectId,
  value: string
}

export type InputType = {
  _id: mongoose.Types.ObjectId;
  label: string;
  value: string;
};

export type FormLeadFields = {
  fieldType: string | number;
  label: string;
  isEnabled: boolean;
  isRequired: boolean;
  placeholder?: string;
  options: Array<{
    label: string;
    value: string;
  }>,
  _id?: mongoose.Types.ObjectId | undefined;
}

