import { Request, Response, NextFunction } from "express";
import { body, check, validationResult, Result, ValidationError } from "express-validator";
import { SubscriptionPlan } from "../types/subscription.types";

export const getUserSubscriptionValidation = [
    check("userId")
    .notEmpty()
    .withMessage("UserId is required")
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

export const createUserSubscriptionValidation = [
  check("userId")
    .notEmpty()
    .withMessage("UserId is required")
    .isMongoId()
    .withMessage("Invalid user ID"),
  check("subscriptionId")
    .notEmpty()
    .withMessage("subscriptionId is required")
    .isMongoId()
    .withMessage("Invalid subscription ID"),
  (req: Request, res: Response, next: NextFunction) => {
    const errors: Result<ValidationError> = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400);
      throw new Error(errors.array()[0]?.msg);
    }

    next();
  },
];


export const createSubscriptionValidation = [
  body("subscription")
    .notEmpty().withMessage("Subscription type is required")
    .isIn(Object.values(SubscriptionPlan)).withMessage("Invalid subscription type"),
  
  body("planType")
    .notEmpty().withMessage("Plan type is required"),

  body("price")
    .notEmpty().withMessage("Price is required")
    .isNumeric().withMessage("Price must be a numeric value"),

  body("features")
    .isArray().withMessage("Features must be an array"),

  (req: Request, res: Response, next: NextFunction) => {
    const errors: Result<ValidationError> = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    next();
  },
];
