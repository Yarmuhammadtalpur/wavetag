import mongoose, { Schema } from 'mongoose';
import { FormDataTypes } from '../types/formData.types';

const formDataSchema = new Schema<FormDataTypes>(
  {
    leadForm: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LeadForm',
      required: true,
    },
    data: [{ type: mongoose.Schema.Types.ObjectId, ref: 'FormFields' ,}], 
  },
  { timestamps: true }
);

const FormData = mongoose.model<FormDataTypes>('FormData', formDataSchema);
export default FormData;
