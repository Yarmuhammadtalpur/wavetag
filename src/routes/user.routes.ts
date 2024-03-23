import { Router } from "express";
import {
  createUser,
  getUserById,
  getUsers,
  updateUserById,
  deleteUserById,
} from "../controllers/user.controller";
import {
  createUserValidation,
  selectUserValidation,
} from "../validations/userValidation";
import { protect } from "../middlewares/auth-middleware";

const router = Router();

router.route("/").get(protect, getUsers).post(createUserValidation, createUser);

router
  .route("/:id")
  .get(selectUserValidation, protect, getUserById)
  .patch(selectUserValidation, protect, updateUserById)
  .delete(selectUserValidation, protect, deleteUserById);

export default router;
