import express from 'express';
import controller from '../controllers/link.controller';
import { checkLinkValidations } from '../validations/link.validation';
const router = express.Router();

router.post('/', checkLinkValidations ,controller.createLink);
router.get('/:linkId', controller.readLink);
router.get('/', controller.readAllLinks);
router.patch('/:linkId',checkLinkValidations, controller.updateLink);
router.delete('/:linkId', controller.deleteLink);

export default router;