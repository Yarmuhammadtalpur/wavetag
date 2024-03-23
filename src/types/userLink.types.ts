import {  Types } from 'mongoose';
import { UserType } from './user.types';
import { LinkType } from './link.types';


// Define the UserLink
export type UserLinkType = {
  user: Types.ObjectId | UserType;
  links: Array<{
    subLink: string;
    link: Types.ObjectId | LinkType; 
  }>;
}