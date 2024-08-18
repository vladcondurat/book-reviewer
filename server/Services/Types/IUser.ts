import mongoose from "mongoose";

export interface IUser extends mongoose.Document {
  username: string;
  email: string;
  role: string;
  avatarUrl: string;
  [key: string]: any;
}
