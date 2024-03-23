import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";

import User from "../models/user.model";

import { UserType } from "../types/user.types";
import { LoginType } from "../types/auth.types";

import { generateExpiredToken, generateToken } from "../utils/generateToken";
import { convertToSha512 } from "../utils/hash";
import {
  AuthenticatedRequest,
  DecodedToken,
} from "../interfaces/auth.interfaces";

/**
 * Its a login api required fields are email or password and return response token message or user.
 *
 * @async
 * @function loginUser
 * @param req - Express Request object with user credentials
 * @param res - Express Response object
 */

const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password }: LoginType = req.body;
  const user: UserType | null = await User.findOne({ email }).lean();

  const hashPassword: string = convertToSha512(password);

  if (user && hashPassword === user.password) {
    const token = generateToken(user._id.toString());

    // TODO: Remove phoen number and qrcode.
    res.status(200).json({
      message: "User login successfully",
      token,
      user: {
        userName: user.username,
        email: user.email,
        phoneNumber: user.phoneNumber,
        full_name: user.full_name,
        // lastName: user.lastName,
        // QrCode: user.QrCode,
        _id: user._id,
      },
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});
/**
 * Invalidate user token and log out ( Its a logout api its required a jwt token in header and verify it and generate a new token if token is already not expired. )
 *
 * @async
 * @function logoutUser
 * @param req - Express Request object with user's authorization header
 * @param res - Express Response object
 */
const logoutUser = asyncHandler(async (req: Request, res: Response) => {
  const { authorization } = req.headers;

  if (!authorization) {
    res.status(401);
    throw new Error("You must be logged in - No authorization header");
  }

  const token = authorization.replace("Bearer ", "");

  try {
    const decoded: DecodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY!
    ) as DecodedToken;

    // Check if the token is still valid (not expired)
    if (decoded.exp !== undefined && decoded.exp <= Date.now() / 1000) {
      res.status(401);
      throw new Error("Token has already expired. Please log in again.");
    }
    const expiredToken = generateExpiredToken(decoded.userId);
    res
      .status(200)
      .json({ message: "User logged out successfully", expiredToken });
  } catch (err) {
    res.status(401);
    throw new Error("You must be logged in - Invalid token");
  }
});

/**
 * Refreshes the access token ( Its a refresh token api to verify jwt token if its not expired and regenerate a new token).
 *
 * @param {Request} req - The Express Request object.
 * @param {Response} res - The Express Response object.
 * @param {NextFunction} next - The Express Next function.
 * @returns {Promise<void>}
 */
const refresh = asyncHandler(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { authorization } = req.headers;

    if (!authorization) {
      res.status(401);
      throw new Error("You must be logged in - No authorization header");
    }

    const token = authorization.replace("Bearer ", "");
    const newtoken: DecodedToken = jwt.decode(token) as DecodedToken;

    if (!newtoken) {
      res.status(400);
      throw new Error("Invalid Token, Please Login Again");
    }
    // Check if the token is still valid (not expired)
    if (newtoken.exp !== undefined && newtoken.exp <= Date.now() / 1000) {
      const newToken: string = generateToken(newtoken.userId);
      res.status(201).json({ token: newToken });
    } else if (
      newtoken.exp !== undefined &&
      newtoken.exp >= Date.now() / 1000
    ) {
      res.status(200).json({ message: "Token is not Expired yet", token });
    } else {
      res.status(400);
      throw new Error("Invalid Token, Please Login Again");
    }
  }
);

export { loginUser, logoutUser, refresh };
