import {  Types } from 'mongoose';
import { UserType } from './user.types';
import { ThemeType } from './theme.types';



// Define the UserProfile
export type UserProfileType = {
    profilePicture: string; // Online URL
    user: Types.ObjectId | UserType;
    address: {
      lat: number;
      lon: number;
      address: string;
    };
    bio: string;
    theme: Types.ObjectId | ThemeType; 
    coverpicture: string;
    cardTitle: string;
  }