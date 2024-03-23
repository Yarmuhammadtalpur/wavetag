import { Types } from "mongoose";
import { UserType } from "./user.types";

// Define the user schema
export enum SubscriptionPlan {
    FREE = 'free',
    PREMIUM = 'premium',
    BUSINESS = 'business',
}
export type SubscriptionTypes = {
    subscription?: SubscriptionPlan;
    planType?: string;
    price?: number;
    features?: [string];
}

export type UserSubscriptionTypes = {
    subscription?: Types.ObjectId | string;
    user?: Types.ObjectId | string;
  }