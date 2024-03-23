import mongoose, { Schema, Types } from "mongoose";
import { IFeatureRequest } from "../interfaces/setting.interfaces";

const featureReqSchema = new Schema<IFeatureRequest>(
  {
    user: { type: Types.ObjectId, ref: "User", required: true, index: true },
    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const FeatureRequest = mongoose.model<IFeatureRequest>("FeatureRequest", featureReqSchema);

FeatureRequest.createIndexes();

export default FeatureRequest;
