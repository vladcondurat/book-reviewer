import mongoose from "mongoose";

export interface IReview extends mongoose.Document {
  description: string;
  rating: number;
  [key: string]: any;
}
