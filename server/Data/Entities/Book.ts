import mongoose from "mongoose";

const BookSchema = new mongoose.Schema({
  description: { type: String, required: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  genre: { type: String, required: true },
  publishingHouse: { type: String, required: true },
  bookCoverImage: { type: String, required: true },
  edition: { type: Number, required: true },
  year: { type: Number, required: true },
  reviews: { type: [String], required: true },
});

export const BookModel = mongoose.model("Book", BookSchema);
