import mongoose, { Schema, Document, Types } from 'mongoose';
import { ThemeType } from '../types/theme.types';

// Define the Theme schema
const themeSchema = new Schema<ThemeType>({
    name: { type: String, required: true },
    themeId: { type: String, required: true },
});

// Export the Theme model
const Theme = mongoose.model<ThemeType>('Theme', themeSchema);

export default Theme;
