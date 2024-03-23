import { Router } from "express";
import { protect } from "../middlewares/auth-middleware";
import { createFormData, getFormDataByLeadFormId } from "../controllers/formData.controller";
import { formDataValidation, getFormDataIdValidation } from "../validations/formData.validation";

const router = Router();

router
  .route("/:leadFormId/:cardId/:userId")
  .post(formDataValidation, createFormData);
router
    .route("/:leadFormId")
    .get(getFormDataIdValidation,protect, getFormDataByLeadFormId)

export default router;
