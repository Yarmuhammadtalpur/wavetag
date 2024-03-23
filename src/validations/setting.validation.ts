import { Request, Response, NextFunction } from "express";
import { body, check, validationResult, Result, ValidationError } from "express-validator";

export const createFeatureRequestValidation = [
  check("user").notEmpty().withMessage("User id is required").isMongoId().withMessage("Invalid user ID"),
  check("message").notEmpty().withMessage("Message is required"),

  (req: Request, res: Response, next: NextFunction) => {
    const errors: Result<ValidationError> = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400);
      throw new Error(errors.array()[0]?.msg);
    }

    next();
  },
];

export const createSupportMessageValidation = [
    check("user").notEmpty().withMessage("User id is required").isMongoId().withMessage("Invalid user ID"),
    check("subject").notEmpty().withMessage("Subject is required"),
    check("message").notEmpty().withMessage("Message is required"),
  
    (req: Request, res: Response, next: NextFunction) => {
      const errors: Result<ValidationError> = validationResult(req);
  
      if (!errors.isEmpty()) {
        res.status(400);
        throw new Error(errors.array()[0]?.msg);
      }
  
      next();
    },
  ];