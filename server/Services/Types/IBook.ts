import mongoose from "mongoose";

export interface IBook extends mongoose.Document {
  description: string;
  title: string;
  author: string;
  genre: string;
  publishingHouse: string;
  bookCoverImage: string;
  edition: number;
  year: number;
  [key: string]: any;
}
