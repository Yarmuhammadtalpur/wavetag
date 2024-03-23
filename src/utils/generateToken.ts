import jwt from "jsonwebtoken";

const generateToken = (userId?: string) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY!, {
    expiresIn: "1hr",
  });

  return token;
};

const generateExpiredToken = (userId: string) => {
  const token = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET!, {
    expiresIn: '1s'
  });

  return token;
};

export { generateToken, generateExpiredToken };
