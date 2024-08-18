import mongoose from "mongoose";
import { NewsTypes } from "../../Data/Constants/NewsTypes";

export interface INews extends mongoose.Document {
  userId: string;
  bookId: string;
  type: NewsTypes;
  createdAt: Date;
  [key: string]: any;
}
