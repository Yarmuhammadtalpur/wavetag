// blogValidator.ts
import { Request, Response, NextFunction } from 'express';
import { Result, ValidationError, body, validationResult } from 'express-validator';

const checkBlogValidations = [
  body('heading').notEmpty().withMessage('Heading cannot be empty'),
  body('blogcontent').notEmpty().withMessage('Blogcontent cannot be empty'),
  body('description').notEmpty().withMessage('Description cannot be empty'),
  body('coverimg').notEmpty().withMessage('CoverImg cannot be empty'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors: Result<ValidationError> = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400);
      throw new Error(errors.array()[0]?.msg);
    }
    
    next();
  },
];


export  { checkBlogValidations };