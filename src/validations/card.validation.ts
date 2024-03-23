import { Request, Response, NextFunction } from "express";
import { body, check, validationResult, Result, ValidationError } from "express-validator";

export const createCardValidation = [
  body("cardTitle").optional().isString().withMessage("Card title must be a string"),
  check("user").notEmpty().withMessage("User Id is required").isMongoId().withMessage("Invalid user ID"),
  // body("theme").isEmpty().withMessage("Theme is required").isMongoId().withMessage("Invalid theme ID"),
  body("hash")
    .notEmpty()
    .withMessage("Card Hash is required")
    .optional()
    .isString()
    .withMessage("Hash must be a string"),
  body("fields.name").optional().isString().withMessage("Name must be a string"),
  body("fields.title").optional().isString().withMessage("Title must be a string"),
  body("fields.company").optional().isString().withMessage("Company must be a string"),
  body("fields.address").optional().isString().withMessage("Address must be a string"),
  body("fields.bio").optional().isString().withMessage("Bio must be a string"),
  body("layout").optional().isString().withMessage("Layout must be a string"),
  // body("socialLinks.*.link").optional().isMongoId().withMessage("Invalid link ID in socialLinks array"),
  body("profilePicture").optional().isString().withMessage("Profile picture must be a string"),
  body("coverPicture").optional().isString().withMessage("Cover picture must be a string"),
  body("companyLogo").optional().isString().withMessage("Company logo must be a string"),
  body("qrCode").notEmpty().withMessage("QR code is required").isString().withMessage("QR code must be a string"),
  body("isLeadEnabled").optional().isBoolean().withMessage("isLeadEnabled must be a boolean"),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400);
      throw new Error(errors.array()[0]?.msg);
    }
    next();
  },
];

export const selectCardValidation = [
  check("id").notEmpty().withMessage("Id is required").isMongoId().withMessage("Invalid card ID"),
  (req: Request, res: Response, next: NextFunction) => {
    const errors: Result<ValidationError> = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400);
      throw new Error(errors.array()[0]?.msg);
    }

    next();
  },
];
