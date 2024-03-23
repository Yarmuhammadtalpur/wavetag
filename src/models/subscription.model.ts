// Import required modules and packages
import mongoose, {  Schema } from 'mongoose';
import { SubscriptionPlan } from '../types/subscription.types';
import { ISubscription } from '../interfaces/subscription.interfaces';

const subscriptionSchema = new Schema<ISubscription>(
  {
    subscription: { type: String, default: SubscriptionPlan.FREE, enum: Object.values(SubscriptionPlan) },
    planType: { type: String, required: true },
    price: { type: Number, required: true,},
    features: { type: [String], default: [] },
  },
  { timestamps: true }
);


const Subscription = mongoose.model<ISubscription>('Subscription', subscriptionSchema);

export default Subscription;
