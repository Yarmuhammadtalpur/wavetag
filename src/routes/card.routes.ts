import { Router } from "express";
import {
  createCard,
  getCardByUserId,
  getCards,
  updateCardById,
  deleteCardById,
} from "../controllers/card.controller";
import {
  selectCardValidation,
  createCardValidation,
} from "../validations/card.validation";

const router = Router();

router.route("/").get(getCards).post(createCardValidation, createCard);

router
  .route("/:id")
  .get(selectCardValidation, getCardByUserId)
  .patch(selectCardValidation, updateCardById)
  .delete(selectCardValidation, deleteCardById);

export default router;
