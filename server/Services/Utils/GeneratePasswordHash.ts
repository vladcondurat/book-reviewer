import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

export const random = () => crypto.randomBytes(128).toString("base64");
export const generatePasswordHash = (salt: string, password: string) => {
  return crypto
    .createHmac("sha256", [salt, password].join("/"))
    .update(process.env.PASSWORD_HASH_SECRET!)
    .digest("hex");
};
