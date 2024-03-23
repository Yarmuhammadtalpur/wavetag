import { Request, Response, NextFunction, RequestHandler } from "express";
import multer, { MulterError, FileFilterCallback } from "multer";
import fs from "fs";

interface CustomError extends Error {
  status?: number;
}

const storage = multer.diskStorage({
  destination: function (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ) {
    const imageType: string = req.params.imageType;
    const destinationFolder = `./public/${imageType}`;

    // Check if the destination folder exists, create it if not
    if (!fs.existsSync(destinationFolder)) {
      fs.mkdirSync(destinationFolder, { recursive: true });
    }

    cb(null, destinationFolder);
  },
  filename: function (
    req: Request,
    file: Express.Multer.File,
    cb: (error: CustomError | null, filename: string) => void
  ) {
    const imageType: string = req.params.imageType;
    const validImageTypes = [
      "profilePictures",
      "coverPictures",
      "postPictures",
      "blogPictures",
    ];
    if (!imageType || !validImageTypes.includes(imageType)) {
      const error: CustomError = new Error("Invalid image type");
      error.status = 400;
      return cb(error, "");
    }
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
): void => {
  if (!file.mimetype.startsWith("image/")) {
    return cb(null, false);
  }
  cb(null, true);
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5, // 5MB file size limit
  },
  fileFilter: fileFilter,
});

const imageMiddleware: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  upload.array("images", 10)(req, res, (error: any) => {
    if (error instanceof multer.MulterError) {
      // Handle Multer-specific errors
      if (error.code === "LIMIT_UNEXPECTED_FILE") {
        return res.status(400).json({
          status: "error",
          message: "Too many files uploaded",
        });
      }
    } else if (error) {
      // Handle other errors, including the custom error thrown in filename
      return res.status(400).json({
        status: "error",
        message: error.message || "Invalid request",
      });
    }
    // If no error occurred, continue with the next middleware or route handler
    next();
  });
};

export default imageMiddleware;
