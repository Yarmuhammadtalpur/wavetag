import { Types } from "mongoose";
import { UserType } from "../types/user.types";
import { SubscriptionPlan, SubscriptionTypes } from "../types/subscription.types";


export interface ISubscription extends Document {
  subscription: SubscriptionPlan;
  planType: string;
  price: number;
  features: string[];
}

export interface IUserSubscription extends Document {
  subscription?: Types.ObjectId | string | SubscriptionTypes | null;
  user?: Types.ObjectId | string | UserType | null;
}