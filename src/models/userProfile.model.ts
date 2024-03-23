import { Schema, Document, model, Types } from 'mongoose';
import { UserProfileType } from '../types/userProfile.types';

// Create a new Mongoose schema for UserProfile
const userProfileSchema = new Schema<UserProfileType>({
  profilePicture: { type: String, required: true,index:true },
  user: { type: Types.ObjectId, ref: 'User', required: true,index:true },
  address: {
    lat: { type: Number, required: true },
    lon: { type: Number, required: true },
    address: { type: String, required: true },
  },
  bio: { type: String, required: true },
  theme: { type: Types.ObjectId, ref: 'Theme', required: true },
  coverpicture: { type: String, required: true },
  cardTitle:{ type: String, required: true }
});

// Create the UserProfile model
const UserProfileModel = model<UserProfileType>('UserProfile', userProfileSchema);
UserProfileModel.createIndexes();

export default UserProfileModel;
