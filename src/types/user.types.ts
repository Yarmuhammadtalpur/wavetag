import { Document } from "mongoose";

// Define the user schema
export interface UserType extends Document {
  username: string;
  email: string;
  phoneNumber: string;
  full_name: string;
  // lastName: string;
  password?: string | null | undefined;
  QrCode: string | null;
  _id: string;
}

export type CreateUserRequest = {
  username: string;
  email: string;
  phoneNumber: string;
  full_name: string;
  // lastName: string;
  password: string;
};

export type AuthenticatedUserType = {
  username: string;
  email: string;
  phoneNumber: string;
  full_name: string;
  // lastName: string;
  QrCode: string | null;
  _id: string;
};
