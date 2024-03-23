import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { LeadFormType, inputType } from "../types/leadForm.types";
import LeadForm from "../models/leadForm.model";
import { CardType } from "../types/card.types";
import Card from "../models/card.model";
import mongoose from "mongoose";

/**
 * Updates a lead form's information by its unique identifier in the database and responds with a JSON object containing the status and updated lead form data.
 *
 * @async
 * @function updateLeadFormById
 * @param {Request} req - The Express Request object containing the lead form ID and updated details in the request body.
 * @param {Response} res - The Express Response object to send the HTTP response.
 * @throws {Error} Throws an error with a message 'Lead form not found' if no lead form is found with the specified ID.
 * @throws {Error} Throws an error with a message 'Text field should not have options' if a text field has predefined options.
 * @returns {Promise<void>} A promise that resolves once the lead form is successfully updated and sent in the HTTP response.
 */

export const updateLeadFormById = asyncHandler(async (req: Request, res: Response) => {

  const formId: string = req.params.id;
  const { card_id, isLeadEnabled, header, fields } = req.body;

  if (!mongoose.Types.ObjectId.isValid(formId)) {
    res.status(400);
    throw new Error("Invalid Lead form id. Please provide a valid ObjectId.");
  }

  if (!mongoose.Types.ObjectId.isValid(card_id)) {
    res.status(400);
    throw new Error("Invalid Card Id. Please provide a valid ObjectId.");
  }
  
  if (typeof isLeadEnabled !== 'boolean') {
    res.status(400);
    throw new Error("Invalid value of Lead capture.");
  }

  const updatedCard: CardType | null = await Card.findByIdAndUpdate(
    card_id,
    { isLeadEnabled: isLeadEnabled },
    { new: true }
  );

  if (!updatedCard) {
    res.status(404);
    throw new Error("Card not found");
  }


  const fieldTypeText: boolean = fields.some((field: inputType) => {
    return (field.fieldType == 'text' || field.fieldType == 'textarea') && field.options.length > 0
  })

  if (fieldTypeText) {
    res.status(400)
    throw new Error("Text field should not have options")
  }

  const updatedLeadForm: LeadFormType | null = await LeadForm.findByIdAndUpdate(
    formId,
    { header, fields },
    { new: true }
  );

  if (!updatedLeadForm) {
    res.status(404);
    throw new Error("Lead form not found");
  }

  res.status(200)
    .json({ message: "Lead form updated", status: "success", data: updatedLeadForm });
});

/**
 * Retrieves a lead form by its unique identifier from the database and responds with a JSON object containing the status and lead form data.
 *
 * @async
 * @function getLeadFormById
 * @param {Request} req - The Express Request object containing the lead form ID in the parameters.
 * @param {Response} res - The Express Response object to send the HTTP response.
 * @throws {Error} Throws an error with a message 'Lead form not found' if no lead form is found with the specified ID.
 * @returns {Promise<void>} A promise that resolves once the lead form is successfully retrieved and sent in the HTTP response.
 */

export const getLeadFormById = asyncHandler(async (req: Request, res: Response) => {

  const formId: string = req.params.id;
  const leadForm: LeadFormType | null = await LeadForm.findOne({ _id: formId });

  if (!leadForm) {
    res.status(400);
    throw new Error("Lead form not found");
  }

  res.status(200)
    .json({ message: "Lead form found", status: "success", data: leadForm });
});

