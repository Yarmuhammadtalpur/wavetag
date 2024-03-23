import { Router } from "express";

import {
  createFeatureRequest,
  createSupportMessage,
  getFeatureRequests,
  getSupportMessages,
} from "../controllers/setting.controller";

import { createFeatureRequestValidation, createSupportMessageValidation } from "../validations/setting.validation";

const router = Router();

router.route("/feature-request").get(getFeatureRequests).post(createFeatureRequestValidation, createFeatureRequest);

router.route("/support-message").get(getSupportMessages).post(createSupportMessageValidation, createSupportMessage);

export default router;