import { Types } from "mongoose";
import { CardType } from "../types/card.types";
import { FormDataTypes } from "../types/formData.types";
import { LeadFormType } from "../types/leadForm.types";

export interface Insights extends Document {
  cardId: Types.ObjectId | CardType;
  leadFormId: Types.ObjectId | LeadFormType;
  numberOfLeadGenerated: number;
  numberOfLinkTaps: number;
  numberOfCardViews: number;
  numberOfContactsDownload: number;
  leads: Array<{
    time?: Date;
    id?: Types.ObjectId | FormDataTypes;
    locationFromIp?: String;
  }>;
}
