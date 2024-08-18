import mongoose from "mongoose";
import { NewsTypes } from "../Constants/NewsTypes";

const NewsSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  bookId: { type: String },
  type: { type: String, required: true },
});

export const NewsModel = mongoose.model("News", NewsSchema);
