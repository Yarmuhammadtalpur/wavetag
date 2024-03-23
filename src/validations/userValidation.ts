import { Request, Response, NextFunction } from "express";
import {
  body,
  check,
  validationResult,
  Result,
  ValidationError,
} from "express-validator";

export const createUserValidation = [
  // body("username").notEmpty().withMessage("Username is required"),
  body("email").isEmail().withMessage("Invalid email address"),
  // body("phoneNumber")
  // .notEmpty()
  // .withMessage("Phone number is required")
  // .isMobilePhone("any")
  // .withMessage("Please enter a valid phone number"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at most 8 characters"),
  (req: Request, res: Response, next: NextFunction) => {
    const errors: Result<ValidationError> = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400);
      throw new Error(errors.array()[0]?.msg);
    }

    next();
  },
];

export const selectUserValidation = [
  check("id")
    .notEmpty()
    .withMessage("Id is required")
    .isMongoId()
    .withMessage("Invalid user ID"),
  (req: Request, res: Response, next: NextFunction) => {
    const errors: Result<ValidationError> = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400);
      throw new Error(errors.array()[0]?.msg);
    }

    next();
  },
];
