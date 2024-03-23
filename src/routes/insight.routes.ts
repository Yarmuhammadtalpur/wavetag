import { Router } from "express";
import {
  getInsightData,
  updateInsightData,
} from "../controllers/insight.controller";
import { protect } from "../middlewares/auth-middleware";

const router = Router();
router.route("/").get(protect, getInsightData);

router.route("/:card_id/:type/:userId").patch(protect, updateInsightData);

export default router;
