import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  bookId: { type: String, required: true },
  description: { type: String, required: true },
  rating: { type: Number, required: true },
  readingProgress: { type: Number, required: true },
});

export const ReviewModel = mongoose.model("Review", ReviewSchema);
