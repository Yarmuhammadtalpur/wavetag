import { NextFunction, Request, Response } from "express";
import { Result, ValidationError, check, validationResult } from "express-validator";

export const formDataValidation = [
    check("leadFormId")
        .notEmpty()
        .withMessage("leadFormId is required")
        .isMongoId()
        .withMessage("Invalid leadFormId"),
    check("cardId")
        .notEmpty()
        .withMessage("cardId is required")
        .isMongoId()
        .withMessage("Invalid cardId"),
    check("userId")
        .notEmpty()
        .withMessage("userId is required")
        .isMongoId()
        .withMessage("Invalid userId"),
    (req: Request, res: Response, next: NextFunction) => {
        const errors: Result<ValidationError> = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(400);
            throw new Error(errors.array()[0]?.msg);
        }

        const formData = req.body.formData;
        if (!Array.isArray(formData)) {
        res.status(400);
        throw new Error("Invalid formData. Expected an array.");
        }
        next();
    },
];
export const getFormDataIdValidation = [
    check("leadFormId")
        .notEmpty()
        .withMessage("leadFormId is required")
        .isMongoId()
        .withMessage("leadForm ID"),
    (req: Request, res: Response, next: NextFunction) => {
        const errors: Result<ValidationError> = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(400);
            throw new Error(errors.array()[0]?.msg);
        }

        next();
    },
];
