import mongoose, { Schema, Types } from 'mongoose';
import { UserLinkType } from '../types/userLink.types';


// Define the UserLink schema
const userLinkSchema = new Schema<UserLinkType>({
    user: { type: Types.ObjectId, ref: 'User', required: true,index:true },
    links: [
        {
            subLink: { type: String, required: true },
            link: { type: Types.ObjectId, ref: 'Link', required: true },
        },
    ],
}, { timestamps: true });

// Export the user model
const UserLink = mongoose.model<UserLinkType>('UserLink', userLinkSchema);
UserLink.createIndexes();

export default UserLink;
