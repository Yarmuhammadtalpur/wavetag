import { Request, Response, NextFunction } from "express";
import { MulterError } from "multer";

/**
 * 
 * @param err 
 * @param req 
 * @param res 
 * @param next 
 */
const errorMiddleWare = (
  err: Error | MulterError, //  TODO: Change this to something else. 
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(err)
  if (err instanceof MulterError) {
    res.status(400);
    return res.json({
      message: err.message,
      stack: err.stack
    })
  }
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode);
  res.json({
    message: err.message.replace("Error: ", ""),
    status: "error",
    stack: err.stack,
  });
};

const notFound = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};



export { errorMiddleWare, notFound };