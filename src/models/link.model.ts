import mongoose, { Schema } from 'mongoose';
import { LinkDocument } from '../types/link.types';
const LinkSchema: Schema = new Schema(
    {
        name: { type: String, required: true,index: true },
        link: { type: String, required: true },
        icon: { type: String, required: true }
    },
    {
        versionKey: false
    }
);

const Link=mongoose.model<LinkDocument>('Link', LinkSchema);
Link.createIndexes();
export default Link;