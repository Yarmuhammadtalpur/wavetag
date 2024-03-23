import { Document, Types } from "mongoose";
import { UserType } from "../types/user.types";

export interface IFeatureRequest extends Document  {
    user: Types.ObjectId | string | UserType;
    message: string;
}

export interface ISupportMessage extends Document {
    user: Types.ObjectId | string | UserType;
    subject: string;
    message: string;
}