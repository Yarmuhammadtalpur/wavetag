import { Document, Types } from "mongoose";
import { UserType } from "./user.types";
import { LinkType } from "./link.types";
import { LeadFormType } from "./leadForm.types";

// Define the fields for the 'fields' property
interface CardFields {
  name: string;
  title: string;
  company: string;
  address: string;
  bio: string;
}

// Define the 'CardType' interface
export interface CardType extends Document {
  cardTitle: string;
  user: Types.ObjectId | UserType;
  theme?: Types.ObjectId;
  hash: string;
  fields: CardFields;
  layout: string;
  socialLinks: Array<{
    link: Types.ObjectId | LinkType;
  }>;
  profilePicture: string; // Assuming a URL or file path
  coverPicture: string; // Assuming a URL or file path
  companyLogo: string; // Assuming a URL or file path
  qrCode: string; // Assuming a URL or file path
  isLeadEnabled: boolean;
  lead: Types.ObjectId | LeadFormType;
}
