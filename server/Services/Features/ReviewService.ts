import { BusinessError } from "../Exceptions/BusinessErrors";
import { HttpStatusCode } from "../Constants/HttpStatusCodes";
import { AuthError } from "../Exceptions/AuthErrors";
import { getReadingProgress } from "./UserService";
import { getBookById } from "../../Data/Repositories/BookRepository";
import {
  addReviewById,
  getReviewsByBookId,
} from "../../Data/Repositories/ReviewRepository";
import {
  addReviewToUser,
  addReviewToBook,
} from "../../Data/Repositories/ReviewRepository";
import { EntityNotFoundError } from "../Exceptions/EntityNotFound";
import { IReview } from "../Types/IReview";

export async function addReview(
  userId: string | null,
  bookId: string,
  reviewData: IReview
): Promise<IReview> {
  const { description, rating } = reviewData;

  if (!bookId || !description || !rating) {
    throw new BusinessError("Bad Request", HttpStatusCode.BAD_REQUEST);
  }

  if (!userId) {
    throw new AuthError("Unauthorized", HttpStatusCode.UNAUTHORIZED);
  }

  const existingBook = await getBookById(bookId);
  if (!existingBook) {
    throw new EntityNotFoundError("Book not found", HttpStatusCode.NOT_FOUND);
  }

  const readingProgress = await getReadingProgress(userId, bookId);

  if (readingProgress < 0) {
    throw new BusinessError(
      "You can't leave a review until you start reading this book",
      HttpStatusCode.BAD_REQUEST
    );
  }

  if (rating < 1 || rating > 5) {
    throw new BusinessError(
      "Rating must be between 1 and 5",
      HttpStatusCode.BAD_REQUEST
    );
  }

  const review = await addReviewById({
    userId,
    bookId,
    description,
    rating,
    readingProgress,
  });

  addReviewToBook(bookId, review._id.toString());
  addReviewToUser(userId, review._id.toString());

  return review;
}

export async function getReviews(bookId: string): Promise<IReview[]> {
  if (!bookId) {
    throw new BusinessError("Bad Request", HttpStatusCode.BAD_REQUEST);
  }

  const book = await getBookById(bookId);
  if (!book) {
    throw new EntityNotFoundError("Book not found", HttpStatusCode.NOT_FOUND);
  }

  const reviews = await getReviewsByBookId(bookId);
  return reviews;
}
