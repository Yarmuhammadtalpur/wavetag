import { NextFunction, Request, Response } from 'express';
import Blog from '../models/blog.model';
import asyncHandler from 'express-async-handler';

import { BlogType } from '../types/blog.types';

/**
 * Creates a new blog with the provided information if no blog with the same coverimage or blog heading
 * already exists in the database, and returns a JSON response with the status and blog details.
 *
 * @async
 * @function createBlog
 * @param {Request} req - The Express Request object containing blog information in the request body.
 * @param {Response} res - The Express Response object to send the HTTP response.
 * @throws {Error} Throws an error with a message 'Item already exists. Choose a different img, heading.'
 *   if a blog with the same img or blog heading already exists.
 * @returns {Promise<void>} A promise that resolves once the blog is successfully created and saved to the database.
 *   The HTTP response includes a JSON object with a message, status, and blog information.
 */
const createBlog = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { heading, blogcontent,cardid, description,coverimg }: BlogType = req.body as BlogType;

    const existingBlog: BlogType | null = await Blog.findOne({ cardid, heading });

    if (existingBlog) {
        res.status(400);
        throw new Error('Blog with the same cardid and heading already exists. Choose a different heading.');
    }

    const newblog: BlogType = new Blog({
        heading, blogcontent,cardid, description,coverimg
    });

    const savedBlog: BlogType = await newblog.save();

    res.status(201).json({  message: "Blog Created",status: "success",data: savedBlog });
});
/**
 * Retrieves information for a blog with the specified blogId and returns a JSON response with the status
 * and blog details if the blog is found in the database. If the blog is not found, it throws an error
 * with a message 'No Information found for provided blog' and returns a 404 status in the HTTP response.
 *
 * @async
 * @function readBlog
 * @param {Request} req - The Express Request object containing the blogId parameter.
 * @param {Response} res - The Express Response object to send the HTTP response.
 * @throws {Error} Throws an error with a message 'No Information found for provided blog' if the blog
 *   with the specified blogId is not found in the database.
 * @returns {Promise<void>} A promise that resolves once the blog information is successfully retrieved
 *   and sent in the HTTP response. The response includes a JSON object with a message, status, and blog details.
 */
const readBlog = asyncHandler(async (req: Request, res: Response) => {
    const blogId:string = req.params.blogId;

    const foundblog: BlogType | null = await Blog.findById(blogId);

    if (foundblog) {
        res.status(200).json({ message: "Blog found", status: "success",data:foundblog });
    } else {
        res.status(404);
        throw new Error('No Information found for provided blog');
    }
});
/**
 * Handles the request to retrieve all blogs from the database.
 *
 * @async
 * @function readAllBlogs
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>} - A Promise that resolves once the operation is complete.
 *
 *
 * @description
 * This function uses the blog model to fetch all blogs from the database and sends a JSON response with the blogs.
 * If no blogs are found, an empty array is returned in the response.
 *
 */
const readAllBlogs = asyncHandler(async (req: Request, res: Response) => {
    const blogs: BlogType[] | null = await Blog.find();

    if (blogs.length === 0) {
        res.status(404);
        throw new Error('No blogs found');
    }

    res.status(200).json({ status: "success", data: blogs || [] });
})

/**
 * Update a blog's information based on the provided blog ID. The update is performed if the new img and blog heading
 * do not conflict with existing entries in the database. Returns a JSON response with the updated blog details.
 *
 * @async
 * @function updateBlog
 * @param {Request} req - The Express Request object containing the updated blog information in the request body.
 * @param {Response} res - The Express Response object to send the HTTP response.
 * @throws {Error} Throws an error with a message 'No information found for the provided blog' and a 404 status
 *   if no blog is found in the database with the provided blog ID.
 * @throws {Error} Throws an error with a message 'Item already exists. Choose a different img, blog heading.' and a 400 status
 *   if the provided img or blog heading already exists in the database.
 * @throws {Error} Throws an error with a message 'img and blog heading are required in the request body' and a 400 status
 *   if the request body is missing either the img or blog heading.
 * @returns {Promise<void>} A promise that resolves once the blog is successfully updated and sent as a JSON response
 *   with a 200 status.
 */
const updateBlog = asyncHandler(async (req: Request, res: Response) => {
    const blogId: string = req.params.blogId;

    const blog: BlogType | null = await Blog.findById(blogId);

    if (blog) {
        const { heading, blogcontent,cardid, description,coverimg } = req.body;

        if (heading || cardid) {
            const existingBlog: BlogType | null = await Blog.findOne({
                $and: [
                    { heading, _id: { $ne: blogId } },
                    { cardid, _id: { $ne: blogId } },
                ],
            });
            

          if (existingBlog) {
            let errorMessage: string = "";

            if (existingBlog.heading === heading) {
              errorMessage = "Heading already exists.Choose a different heading";
            } 

            res.status(400);
            throw new Error(errorMessage);
          }
        }

        blog.heading = heading || blog.heading;
        blog.blogcontent = blogcontent || blog.blogcontent;
        blog.cardid = cardid || blog.cardid;
        blog.description = description || blog.description;
        blog.coverimg = coverimg || blog.coverimg;

        await blog.save();

        res.status(200).json({ message: "Blog updated", status: "success", data: blog });
    } else {
        res.status(404);
        throw new Error('No information found for the provided Blog');
    }
});

/**
 * Delete a blog based on the provided blog ID.
 *
 * @async
 * @function deleteBlog
 * @param {Request} req - The Express Request object.
 * @param {Response} res - The Express Response object to send the HTTP response.
 * @throws {Error} Throws an error with a message 'No Information found for provided blog' and a 404 status
 *   if no blog is found in the database with the provided blog ID.
 * @returns {Promise<void>} A promise that resolves once the blog is successfully deleted and sent as a JSON response
 *   with a 200 status, including the deleted blog information and a 'Deleted' message.
 *
 * @description The `lean()` method is used to return a plain JavaScript object instead of a Mongoose Document
 *   when querying the database. This can improve performance by skipping the instantiation of full Mongoose documents,
 *   resulting in a more lightweight result. However, keep in mind that using `lean()` means you won't have access to
 *   Mongoose document methods or features.
 */
const deleteBlog = asyncHandler(async (req: Request, res: Response) => {
    const blogId: string = req.params.blogId;
    
    const deletedblog: BlogType | null = await Blog.findByIdAndDelete(blogId).lean();

    if (deletedblog) {
        res.status(200).json({ message: "Blog deleted", status: "success" });
    } else {
        res.status(404);
        throw new Error('No Information found for provided Blog');
    }
});

export default { createBlog,readBlog,readAllBlogs,updateBlog,deleteBlog };