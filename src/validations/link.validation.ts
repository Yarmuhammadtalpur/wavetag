// linkValidator.ts
import { Request, Response, NextFunction } from 'express';
import { Result, ValidationError, body, validationResult } from 'express-validator';

const checkLinkValidations = [
  body('name').notEmpty().withMessage('Name cannot be empty'),
  body('link').notEmpty().withMessage('Link cannot be empty'),
  body('icon').notEmpty().withMessage('Icon cannot be empty'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors: Result<ValidationError> = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400);
      throw new Error(errors.array()[0]?.msg);
    }
    
    next();
  },
];


export  { checkLinkValidations };