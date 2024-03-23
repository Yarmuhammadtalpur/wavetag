import express from 'express';
import controller from '../controllers/blog.controller';

import { checkBlogValidations } from '../validations/blog.validation';
const router = express.Router();

router.post('/', checkBlogValidations,controller.createBlog);
router.get('/:blogId', controller.readBlog);
router.get('/', controller.readAllBlogs);
router.patch('/:blogId',checkBlogValidations, controller.updateBlog);
router.delete('/:blogId', controller.deleteBlog);

export default router;