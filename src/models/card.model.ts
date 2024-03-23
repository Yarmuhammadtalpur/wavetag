import mongoose, { Schema } from "mongoose";
import { CardType } from "../types/card.types";

const CardSchema = new Schema<CardType>(
  {
    cardTitle: { type: String, required: false },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    // theme: { type: Schema.Types.ObjectId, required: true, ref: "Theme" },
    hash: { type: String, required: true },
    fields: {
      name: { type: String, default: "" },
      title: { type: String, default: ""},
      company: { type: String, default: "" },
      address: { type: String, default: "" },
      bio: { type: String, default: "" },
    },
    layout: { type: String, required: false },
    socialLinks: [
      {
        link: { type: Schema.Types.ObjectId, ref: "Link", required: false },
      },
    ],
    profilePicture: { type: String, required: false, default: "" },
    coverPicture: { type: String, required: false, default: "" },
    companyLogo: { type: String, required: false,  default: "" },
    qrCode: { type: String, required: true },
    isLeadEnabled: { type: Boolean, required: false, default: false },
    lead: { type: Schema.Types.ObjectId, ref: "LeadForm", required: false },
  },
  { timestamps: true }
);

const Card = mongoose.model<CardType>("Card", CardSchema);
export default Card;
