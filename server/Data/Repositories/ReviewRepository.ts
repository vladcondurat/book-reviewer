import { BookModel } from "../Entities/Book";
import { UserModel } from "../Entities/User";
import { IAddReview } from "../../Services/Types/IAddReview";
import { IReview } from "../../Services/Types/IReview";
import { ReviewModel } from "../Entities/Review";

export const getReviewsByBookId = (bookId: string): Promise<IReview[]> =>
  ReviewModel.find({ bookId: bookId }).then((reviews) => reviews.reverse());

export const addReviewById = (values: IAddReview): Promise<IReview> =>
  new ReviewModel(values).save().then((review) => review.toObject());

export const addReviewToBook = (
  bookId: string,
  reviewId: string
): Promise<string[]> =>
  BookModel.findByIdAndUpdate(
    bookId,
    { $addToSet: { reviews: reviewId } },
    { new: true }
  ).then((book) => book!.reviews);

export const addReviewToUser = (
  userId: string,
  reviewId: string
): Promise<string[]> =>
  UserModel.findByIdAndUpdate(
    userId,
    { $addToSet: { reviews: reviewId } },
    { new: true }
  ).then((user) => user!.reviews);
