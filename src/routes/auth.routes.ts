import { Router } from "express";
import { loginUser, logoutUser, refresh } from "../controllers/auth.controller";
import { protect } from "../middlewares/auth-middleware";

const router = Router();

router.post("/login", loginUser);
router.post("/logout", protect, logoutUser);
router.post("/refresh", refresh);

export default router;
