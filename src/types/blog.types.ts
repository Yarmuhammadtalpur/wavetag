import { Document } from "mongoose";

// Define the user schema
export interface BlogType extends Document {
  heading: string;
  blogcontent: string;
  cardid: string;
  description: string;
  coverimg: string;
  _id: string;
}
