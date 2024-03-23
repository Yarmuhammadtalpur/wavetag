import { AuthenticatedUserType } from "./../types/user.types";
import jwt from "jsonwebtoken";
import { Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";

import { AuthenticatedRequest } from "../interfaces/auth.interfaces";
import { DecodedToken } from "../interfaces/auth.interfaces";
import User from "../models/user.model";

/**
 *  Protected endpoint requiring user authentication (Bearer token for authentication)
 *
 * @async
 * @function protect
 * @param req
 * @param res
 * @param next
 */
const protect = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    // let token: string | undefined = req.headers.authorization?.split(" ")[1];
    let token: string | undefined = req.headers.authorization?.replace(
      "Bearer ",
      ""
    );

    if (!token) {
      res.status(401);
      throw new Error("Not authorized, no token");
    }

    try {
      const decoded: DecodedToken = jwt.verify(
        token,
        process.env.JWT_SECRET_KEY!
      ) as DecodedToken;

      req.user = (await User.findById(decoded.userId).select(
        "-password"
      )) as AuthenticatedUserType;

      if (!req.user) {
        res.status(401);
        throw new Error("Unauthorized - User not found");
      }

      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }
);

export { protect };
