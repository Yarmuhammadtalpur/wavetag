import { Document, Types } from 'mongoose';

// Define the user schema
export interface IUser extends Document {
    username: string;
    email: string;
    phoneNumber: string;
    firstName: string;
    lastName: string;
    password: string;
    QrCode: string;
}
// Define the UserProfile
export interface UserProfile extends Document {
  profilePicture: string; // Online URL
  user: Types.ObjectId | IUser;
  address: {
    lat: number;
    lon: number;
    address: string;
  };
  bio: string;
  theme: Types.ObjectId | ITheme; 
}
// Define the UserLink
export interface IUserLink extends Document {
  user: Types.ObjectId | IUser;
  links: Array<{
    subLink: string;
    link: Types.ObjectId | ILink; 
  }>;
}
// Define the Link
export interface ILink extends Document { 
  name: string;
  link: string;
  icon: string; // SVG
}
// Define the ITheme
export interface ITheme extends Document { 
  name: string;
  themeId: string;
}
