import mongoose, { Schema, Types } from "mongoose";
import { ISupportMessage } from "../interfaces/setting.interfaces";

const supportSchema = new Schema<ISupportMessage>(
  {
    user: { type: Types.ObjectId, ref: "User", required: true, index: true },
    subject: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const SupportMessage = mongoose.model<ISupportMessage>("SupportMessage", supportSchema);

SupportMessage.createIndexes();

export default SupportMessage;
