import { Router } from "express";

import {
  getUserSubscription,
  createUserSubscription,
  getSubscription,
  createSubscription,
} from "../controllers/subscription.controller";
import { protect } from "../middlewares/auth-middleware";
import { createSubscriptionValidation, createUserSubscriptionValidation, getUserSubscriptionValidation } from "../validations/userSubscriptionValidation";


const router = Router();

router.route("/user/:userId").get(getUserSubscriptionValidation,getUserSubscription)
router.route("/user/:userId/:subscriptionId").post(createUserSubscriptionValidation,createUserSubscription);
router.route("/").get(getSubscription).post(createSubscriptionValidation,createSubscription);

export default router;