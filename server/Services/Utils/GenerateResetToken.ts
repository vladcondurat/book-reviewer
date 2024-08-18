import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

export const generateResetToken = (email: string) => {
  const token = jwt.sign({ email }, process.env.JWT_SECRET!, {
    expiresIn: "1h",
  });

  return token;
};
