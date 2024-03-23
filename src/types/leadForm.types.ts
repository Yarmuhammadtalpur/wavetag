import { Document } from "mongoose";

export type inputType = {
    fieldType: string | number,
    label: string,
    isEnabled: boolean,
    isRequired: boolean,
    placeholder?: string,
    options: Array<{
        label: string,
        value: string,
    }>
}

export interface LeadFormType extends Document {
    header: string;
    fields: Array<inputType>
};
