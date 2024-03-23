// Import required modules and packages
import mongoose, {  Schema } from 'mongoose';
import { BlogType } from '../types/blog.types';

const blogSchema = new Schema<BlogType>(
  {
    heading: { type: String, required: true, index: true },
    blogcontent: { type: String, required: true },
    cardid: { type: String, required: true },
    description: { type: String, required: true },
    coverimg: { type: String, required: true },
  },
  { timestamps: true }
);


const Blog = mongoose.model<BlogType>('Blog', blogSchema);
Blog.createIndexes();

export default Blog;
