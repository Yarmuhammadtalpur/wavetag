import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Insight from "../models/insight.model";
import { Insights as InsightTypes } from "../interfaces/insights.interfaces";
import { Types } from "mongoose";
import { sendNotification } from "../utils/Notification";

/**
 * Retrieves Insight Data from the database and responds with a JSON object containing the status and insight data.
 *
 * @async
 * @function getInsightData
 * @param {Request} req - The Express Request object (unused in this function).
 * @param {Response} res - The Express Response object to send the HTTP response.
 * @throws {Error} Throws an error with a message 'Insight Data not Found' if no data found in the database.
 * @returns {Promise<void>} A promise that resolves once the Insight Data is successfully retrieved and sent in the HTTP response.
 */

const getInsightData = asyncHandler(async (req: Request, res: Response) => {
  const insightData: InsightTypes[] = await Insight.find().lean();

  if (insightData.length === 0) {
    res.status(404);
    throw new Error("Insight Data not Found");
  }
  res.status(200).json({ status: "success", data: insightData });
});

/**
 * Updates a insight's information by its unique identifier in the database and responds with a JSON object containing the status and updated insight data.
 *
 * @async
 * @function updateInsightData
 * @param {Request} req - The Express Request object containing the insight ID and updated insight details in the request body.
 * @param {Response} res - The Express Response object to send the HTTP response.
 * @throws {Error} Throws an error with a message 'Insight Data not Found' if no insight data is found with the specified ID.
 * @returns {Promise<void>} A promise that resolves once the insight data is successfully updated and sent in the HTTP response.
 */

const updateInsightData = asyncHandler(async (req: Request, res: Response) => {
  const cardId: string = req.params.card_id;
  const reqType: string = req.params.type;
  const userId: string = req.params.userId;

  if (!cardId) {
    res.status(400);
    throw new Error("Card Id not Found");
  }

  if (!reqType) {
    res.status(400);
    throw new Error("Type not Found");
  }

  const insight = await Insight.findOne({ cardId });

  if (insight && reqType === "linkTap") {
    await Insight.findOneAndUpdate(
      { cardId },
      { ...insight, numberOfLinkTaps: insight.numberOfLinkTaps + 1 }
    );
    const notificationObj = {
      title: "One more Link Tap",
      body: `One more Link Tap from the user`,
      time: new Date().toLocaleString("en-US", {
        timeZone: "America/New_York",
      }),
      to: userId,
      type: "LinkTap"
    } 

    sendNotification(notificationObj)

    res.status(200).json({
      message: "updated successfully",
      status: "success",
    });
  }

  if (insight && reqType === "download") {
    await Insight.findOneAndUpdate(
      { cardId },
      {
        ...insight,
        numberOfContactsDownload: insight.numberOfContactsDownload + 1,
      }
    );
    const notificationObj = {
      title: "One more Download",
      body: `Someone downloaded your contact details`,
      time: new Date().toLocaleString("en-US", {
        timeZone: "America/New_York",
      }),
      to: userId,
      type: "Download"
    } 

    sendNotification(notificationObj)

    res.status(200).json({
      message: "updated successfully",
      status: "success",
    });
  }

  if (insight && reqType === "cardView") {
    await Insight.findOneAndUpdate(
      { cardId },
      {
        ...insight,
        numberOfCardViews: insight.numberOfCardViews + 1,
      }
    );

    const notificationObj = {
      title: "Card View",
      body: `Someone view your card.`,
      time: new Date().toLocaleString("en-US", {
        timeZone: "America/New_York",
      }),
      to: userId,
      type: "LinkTap"
    } 

    sendNotification(notificationObj)

    res.status(200).json({
      message: "updated successfully",
      status: "success",
    });
  }
});

export { getInsightData, updateInsightData };
