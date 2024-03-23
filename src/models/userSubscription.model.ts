// Import required modules and packages
import mongoose, {  Schema, Types } from 'mongoose';
import { IUserSubscription } from '../interfaces/subscription.interfaces';

const userSubscriptionSchema = new Schema<IUserSubscription>(
  {
    subscription: { type: Types.ObjectId, ref: 'Subscription', required: true , index:true },
    user: { type: Types.ObjectId, ref: 'User', required: true , index:true },
  },
  { timestamps: true }
);


const UserSubscription = mongoose.model<IUserSubscription>('UserSubscription', userSubscriptionSchema);

export default UserSubscription;
