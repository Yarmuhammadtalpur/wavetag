// types.ts
import { Document } from 'mongoose';

export interface LinkType {
    name: string;
    link: string;
    icon: string;
}

export interface DeletedLinkType {
  id:string;
  name: string;
  link: string;
  icon: string;
}

export interface LinkDocument extends LinkType, Document {}