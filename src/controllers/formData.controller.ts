import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import mongoose, { ObjectId } from "mongoose";
import LeadForm from "../models/leadForm.model";
import FormData from "../models/formData.model";
import Card from "../models/card.model";
import { InputType, FormLeadFields } from "../types/fields.types";
import { FormDataTypes } from "../types/formData.types";
import { LeadFormType } from "../types/leadForm.types";
import Insight from "../models/insight.model";
import { sendNotification } from "../utils/Notification";

/**
 * Create Formdata using leadFormId or CardId and validate field or required fileds.
 *
 * @async
 * @function
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @throws {Error} Throws an error with an appropriate message if validation fails or data creation fails.
 * @returns {Promise<void>} A Promise representing the asynchronous operation.
 */
export const createFormData = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const leadFormId: string = req.params.leadFormId;
    const cardId: string = req.params.cardId;
    const userId: string = req.params.userId;
    const { formData } = req.body;

    const [leadForm, card, insight] = await Promise.all([
      LeadForm.findById(leadFormId),
      Card.findById(cardId),
      Insight.findOne({ cardId }),
    ]);

    if (!leadForm) {
      res.status(400);
      throw new Error("Lead Form not found");
    }

    if (!card) {
      res.status(400);
      throw new Error("Card not found");
    }
    const missingRequiredFields: FormLeadFields[] = leadForm.fields.filter(
      (field: FormLeadFields) => {
        const isFieldMissing: boolean =
          field.isRequired &&
          !formData.some((dataField: InputType) => {
            if (field._id) {
              return (
                dataField._id.toString() === field._id.toString() &&
                dataField.value.trim() !== ""
              );
            }
          });
        return isFieldMissing;
      }
    );
    if (missingRequiredFields.length > 0) {
      res.status(400);
      throw new Error(
        `Required fields are missing or not filled: ${missingRequiredFields[0].label}`
      );
    }
    const unrequiredFields: FormLeadFields[] = leadForm.fields.filter(
      (field: FormLeadFields) => {
        const isUnrequiredFieldMatching: boolean = !formData.some(
          (dataField: InputType) => {
            if (field._id) {
              return dataField._id.toString() === field._id.toString();
            }
          }
        );
        return isUnrequiredFieldMatching;
      }
    );
    if (unrequiredFields.length > 0) {
      res.status(400);
      throw new Error(`Id is not Valid or All Fields are Required`);
    }
    const savedFormData: FormDataTypes = await FormData.create({
      leadForm: leadFormId,
      data: formData,
    });

    if (insight) {
      const insightUpdates = {
        ...insight,
        numberOfLeadGenerated: insight.numberOfLeadGenerated + 1,
        leads: [
          ...insight.leads,
          {
            id: savedFormData._id,
            time: new Date().toLocaleString("en-US", {
              timeZone: "America/New_York",
            }),
          },
        ],
      };
      await Insight.findByIdAndUpdate(cardId, insightUpdates);
    } else {
      await Insight.create({
        numberOfLeadGenerated: 1,
        leads: [
          {
            id: savedFormData._id,
            time: new Date().toLocaleString("en-US", {
              timeZone: "America/New_York",
            }),
          },
        ],
      });
    }

    const notificationObj = {
      title: "You have a new Lead",
      body: `You have a new lead received from the user`,
      time: new Date().toLocaleString("en-US", {
        timeZone: "America/New_York",
      }),
      to: userId,
      type: "LeadForm"
    } 

    sendNotification(notificationObj)

    res.status(201).json({
      message: "Form data saved successfully",
      status: "success",
      savedFormData,
    });
  }
);

/**
 * GetFormDataByLeadFormId - Controller function to retrieve form data based on the leadFormId.
 *
 * @async
 * @function
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @throws {Error} Throws an error with an appropriate message if validation fails or data retrieval fails.
 * @returns {Promise<void>} A Promise representing the asynchronous operation.
 */
export const getFormDataByLeadFormId = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const leadFormId: string = req.params.leadFormId;

    const formDataList: FormDataTypes[] | null = await FormData.find({
      leadForm: leadFormId,
    });

    res.status(200).json({
      message: "Form data retrieved successfully",
      status: "success",
      data: formDataList,
    });
  }
);
