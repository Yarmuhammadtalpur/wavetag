import { Request, Response } from "express";
import asyncHandler from "express-async-handler";

import { IFeatureRequest, ISupportMessage } from "./../interfaces/setting.interfaces";

import FeatureRequest from "../models/featureRequest.model";
import User from "../models/user.model";

import { UserType } from "../types/user.types";
import { CreateFeatureRequest, CreateSupportMessage } from "../types/setting.types";
import SupportMessage from "../models/support.model";


/**
 * Create a new feature request with userid and message.
 *
 * @function
 * @async
 * @param {Request} req - Express request object containing the feature request details.
 * @param {Response} res - Express response object.
 * @returns {Promise<void>} A Promise that resolves when the feature request is created.
 * @throws {Error} If there is an issue creating the feature request.
 */
export const createFeatureRequest = asyncHandler(async (req: Request, res: Response) => {
  const { user, message }: CreateFeatureRequest = req.body;

  const userExist: UserType | null = await User.findById(user);

  if (!userExist) {
    res.status(404);
    throw new Error("User not found");
  }

  const featureRequest: IFeatureRequest = new FeatureRequest({
    user,
    message,
  });

  featureRequest.save();

  res.status(201).json({ status: "succuss", data: featureRequest });
});

/**
 * Get all feature requests with user details populated.
 *
 * @function
 * @async
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @returns {Promise<void>} A Promise that resolves when the feature requests are retrieved.
 * @throws {Error} If there is an issue retrieving the feature requests.
 */
export const getFeatureRequests = asyncHandler(async (req: Request, res: Response) => {
  const featureRequests: IFeatureRequest[] = await FeatureRequest.find().populate(
    "user",
    "username email firstName lastName"
  );

  res.status(200).json({ status: "success", data: featureRequests });
});

/**
 * Create a new support message with user, subject and message.
 *
 * @function
 * @async
 * @param {Request} req - Express request object containing the support message details.
 * @param {Response} res - Express response object.
 * @returns {Promise<void>} A Promise that resolves when the support message is created.
 * @throws {Error} If there is an issue creating the support message.
 */
export const createSupportMessage = asyncHandler(async (req: Request, res: Response) => {
  const { user, subject, message }: CreateSupportMessage = req.body;

  const userExist: UserType | null = await User.findById(user);

  if (!userExist) {
    res.status(404);
    throw new Error("User not found");
  }

  const supportMessage: ISupportMessage = new SupportMessage({
    user,
    subject,
    message,
  });

  supportMessage.save();

  res.status(201).json({ status: "success", data: supportMessage });
});

/**
 * Get all support messages with user details populated.
 *
 * @function
 * @async
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @returns {Promise<void>} A Promise that resolves when the support messages are retrieved.
 * @throws {Error} If there is an issue retrieving the support messages.
 */
export const getSupportMessages = asyncHandler(async (req: Request, res: Response) => {
  const supportMessages: ISupportMessage[] = await SupportMessage.find().populate(
    "user",
    "username email firstName lastName"
  );

  res.status(200).json({ status: "success", data: supportMessages });
});
