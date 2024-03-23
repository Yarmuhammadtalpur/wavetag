import { Router } from "express";
import { getLeadFormById, updateLeadFormById } from "../controllers/leadForm.controller";
import { protect } from "../middlewares/auth-middleware";

const router = Router();

router
  .route("/:id")
  .get(protect, getLeadFormById)
  .patch(protect, updateLeadFormById)

export default router;
