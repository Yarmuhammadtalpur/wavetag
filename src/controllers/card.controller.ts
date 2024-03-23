import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { Document, ModifyResult } from "mongoose";
import { CardType } from "../types/card.types";
import Card from "../models/card.model";
import User from "../models/user.model";
import { UserType } from "../types/user.types";
import { LeadFormType } from "../types/leadForm.types";
import LeadForm from "../models/leadForm.model";

/**
 * Creates a new card with the provided information and returns a JSON response with the status and card details.
 *
 * @async
 * @function createCard
 * @param {Request} req - The Express Request object containing card information in the request body.
 * @param {Response} res - The Express Response object to send the HTTP response.
 * @throws {Error} Throws an error with a message 'Card already exists' if a card with the same title already exists in the database.
 * @returns {Promise<void>} A promise that resolves once the card is successfully created and saved to the database. The HTTP response includes a JSON object with a message, status, and card information.
 */
export const createCard = asyncHandler(async (req: Request, res: Response) => {
  const {
    cardTitle,
    user,
    theme,
    layout,
    qrCode,
  } = req.body;

  const isUserExists: UserType | null = (await User.findById(user).select(
    "-password"
  )) as UserType;

  if (!isUserExists) {
    res.status(400);
    throw new Error("User not found");
  }

  const newLeadForm: LeadFormType = new LeadForm({
    header: "",
    fields: []
  })

  const newCard: CardType = new Card({
    cardTitle,
    user,
    theme,
    hash: "ABCDEFGHIJKLMNOPQRSTUVWXYZabc",
    layout,
    qrCode,
    lead: newLeadForm._id
  });

  await newCard.save();
  await newLeadForm.save();

  res.status(201).json({
    message: "Card Created",
    status: "success",
    data: newCard,
  });
});

/**
 * Retrieves all cards from the database and responds with a JSON object containing the status and card data.
 *
 * @async
 * @function getCards
 * @param {Request} req - The Express Request object (unused in this function).
 * @param {Response} res - The Express Response object to send the HTTP response.
 * @throws {Error} Throws an error with a message 'Cards not found' if no cards are found in the database.
 * @returns {Promise<void>} A promise that resolves once the cards are successfully retrieved and sent in the HTTP response.
 */
export const getCards = asyncHandler(async (req: Request, res: Response) => {
  const cards: CardType[] = await Card.find().lean();

  if (cards.length === 0) {
    res.status(404);
    throw new Error("Cards not found");
  }

  res.status(200).json({ status: "success", data: cards });
});

/**
 * Retrieves a card by its unique identifier from the database and responds with a JSON object containing the status and card data.
 *
 * @async
 * @function getCardById
 * @param {Request} req - The Express Request object containing the card ID in the parameters.
 * @param {Response} res - The Express Response object to send the HTTP response.
 * @throws {Error} Throws an error with a message 'Card not found' if no card is found with the specified ID.
 * @returns {Promise<void>} A promise that resolves once the card is successfully retrieved and sent in the HTTP response.
 */
export const getCardByUserId = asyncHandler(
  async (req: Request, res: Response) => {
    const userId: string = req.params.id;

    const user: UserType | null = (await User.findById(userId).select(
      "-password"
    )) as UserType;

    if (!user) {
      res.status(400);
      throw new Error("User not found");
    }

    const card: CardType | null = await Card.findOne({ user: userId });

    if (!card) {
      res.status(400);
      throw new Error("Card not found");
    }

    res
      .status(200)
      .json({ message: "Card found", status: "success", data: card });
  }
);

/**
 * Updates a card's information by its unique identifier in the database and responds with a JSON object containing the status and updated card data.
 *
 * @async
 * @function updateCardById
 * @param {Request} req - The Express Request object containing the card ID and updated card details in the request body.
 * @param {Response} res - The Express Response object to send the HTTP response.
 * @throws {Error} Throws an error with a message 'Card not found' if no card is found with the specified ID.
 * @returns {Promise<void>} A promise that resolves once the card is successfully updated and sent in the HTTP response.
 */
export const updateCardById = asyncHandler(
  async (req: Request, res: Response) => {
    const cardId: string = req.params.id;
    const updatedCard: CardType | null = await Card.findByIdAndUpdate(
      cardId,
      req.body,
      { new: true }
    );

    if (!updatedCard) {
      res.status(404);
      throw new Error("Card not found");
    }

    res
      .status(200)
      .json({ message: "Card updated", status: "success", data: updatedCard });
  }
);

/**
 * Deletes a card by its unique identifier from the database and responds with a JSON object containing the status and deleted card data.
 *
 * @async
 * @function deleteCardById
 * @param {Request} req - The Express Request object containing the card ID in the parameters.
 * @param {Response} res - The Express Response object to send the HTTP response.
 * @throws {Error} Throws an error with a message 'Card not found' if no card is found with the specified ID.
 * @returns {Promise<void>} A promise that resolves once the card is successfully deleted and sent in the HTTP response.
 */
export const deleteCardById = asyncHandler(
  async (req: Request, res: Response) => {
    const cardId: string = req.params.id;
    const deletionResult: ModifyResult<
      Document<unknown, {}, CardType> & CardType & Required<{ _id: string }>
    > = await Card.findByIdAndDelete(cardId);

    if (!deletionResult) {
      res.status(404);
      throw new Error("Card not found");
    }

    res.status(200).json({ message: "Card deleted", status: "success" });
  }
);
