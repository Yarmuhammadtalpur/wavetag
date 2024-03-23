import { Router } from 'express';
import controller from '../controllers/image.controller';
import imageMiddleware from '../middlewares/multer-middleware';
const router = Router();

router.post('/image/:imageType', imageMiddleware, controller.uploadImage);

export default router;
