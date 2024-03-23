import { Request } from "express";
import { AuthenticatedUserType } from "../types/user.types";
import { JwtPayload } from "jsonwebtoken";

export interface AuthenticatedRequest extends Request {
    user?: AuthenticatedUserType
}
  
export interface DecodedToken extends JwtPayload {
    userId: string;
    iat?: number;
    exp?: number;
}
