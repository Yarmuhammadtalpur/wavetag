import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import User from "../models/user.model";
import { UserType } from "../types/user.types";
import UserSubscription from "../models/userSubscription.model";
import Subscription from "../models/subscription.model";
import { SubscriptionTypes } from "../types/subscription.types";

/**
 * Create a new user subscription with userId and subscriptionId required to create userSubscription.
 *
 * @function
 * @async
 * @param {Request} req - Express request object containing the support message details.
 * @param {Response} res - Express response object.
 * @returns {Promise<void>} A Promise that resolves when the support message is created.
 * @throws {Error} If there is an issue creating the support message.
 */
export const createUserSubscription = asyncHandler(async (req: Request, res: Response) => {
    const { subscriptionId, userId } = req.params;

    const userExist: UserType | null = await User.findById(userId);

    if (!userExist) {
        res.status(404);
        throw new Error("User not found");
    }
    const subscriptionExist: SubscriptionTypes | null = await Subscription.findById(subscriptionId)

    if (!subscriptionExist) {
        res.status(404);
        throw new Error("Subscription not exist");
    }

    const userSubscription = new UserSubscription({
        subscription: subscriptionId,
        user: userId,
    });

    userSubscription.save();

    res.status(201).json({ status: "succuss", data: userSubscription });
});

/**
 * Get user subscription with subscription details as well as user detail.
 *
 * @function
 * @async
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @returns {Promise<void>} A Promise that resolves when the support messages are retrieved.
 * @throws {Error} If there is an issue retrieving the support messages.
 */
export const getUserSubscription = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const subscription: SubscriptionTypes | null = await UserSubscription.findOne({ user: userId }).populate('subscription')
    .populate(
        "user",
        "username email firstName lastName"
      );

    res.status(200).json({ status: "success", data: subscription });
});

/**
 * Create a new subscription with subscription, planType, price and features.
 *
 * @function
 * @async
 * @param {Request} req - Express request object containing the support message details.
 * @param {Response} res - Express response object.
 * @returns {Promise<void>} A Promise that resolves when the support message is created.
 * @throws {Error} If there is an issue creating the support message.
 */
export const createSubscription = asyncHandler(async (req: Request, res: Response) => {

    const { subscription, planType, price, features }: SubscriptionTypes = req.body;
    const newsubscription = new Subscription({
        subscription,
        planType,
        price,
        features
    });
    await newsubscription.save();

    res.status(201).json({ status: 'success', data: newsubscription });
});

/**
 * Get all subscriptions details.
 *
 * @function
 * @async
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @returns {Promise<void>} A Promise that resolves when the support messages are retrieved.
 * @throws {Error} If there is an issue retrieving the support messages.
 */
export const getSubscription = asyncHandler(async (req: Request, res: Response) => {

    const subscriptions: SubscriptionTypes[] | null = await Subscription.find({});

    res.status(200).json({ status: "success", data: subscriptions });
});

