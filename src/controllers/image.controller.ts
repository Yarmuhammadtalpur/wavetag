import { Request, Response } from "express";
import asyncHandler from "express-async-handler";

/**
 *  Handles image upload. If no image is selected or imageType not added, returns an error message. 
 *  Otherwise, responds with a success message.
 *
/**
 * @swagger
 * @function uploadImage
 * @param {Request} req - The Express Request object containing image information in the request body.
 * @param {Response} res - The Express Response object to send the HTTP response.
 * @throws {Error} Throws an error with a message 'Please select an image.' if no image is selected.
 * @returns {Promise<void>} A promise that resolves once the image is successfully uploaded.
 */
const uploadImage = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const imageType: string = req.params.imageType; // Assuming you pass imageType in the request body

    if (!imageType || !req.files || req.files.length === 0) {
      res.status(400);
      throw new Error("Please select an image.");
    } else {
      const path = (req.files as Express.Multer.File[]).map(
        (file: Express.Multer.File) => file.path
      );
      res
        .status(201)
        .json({ message: "Image(s) Uploaded", status: "success", path });
    }
  }
);

export default { uploadImage };
