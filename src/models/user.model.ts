// Import required modules and packages
import mongoose, { Schema } from "mongoose";
import { UserType } from "../types/user.types";

const userSchema = new Schema<UserType>(
  {
    username: { type: String, unique: true, required: true, index: true },
    email: { type: String, unique: true, required: true, index: true },
    // phoneNumber: { type: String, unique: true, required: false, index: true },
    full_name: { type: String, required: true, default: "" },
    // lastName: { type: String, required: true, default: "" },
    password: { type: String, required: true, default: null },
    // QrCode: { type: String, default: null },
  },
  { timestamps: true }
);

const User = mongoose.model<UserType>("User", userSchema);

User.createIndexes();

export default User;
