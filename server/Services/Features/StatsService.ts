import { BusinessError } from "../Exceptions/BusinessErrors";
import { HttpStatusCode } from "../Constants/HttpStatusCodes";
import {
  getReadingProgressByUserId,
  getReviewsByUserId,
  getUserById,
} from "../../Data/Repositories/UserRepository";
import { getBookById } from "../../Data/Repositories/BookRepository";
import { EntityNotFoundError } from "../Exceptions/EntityNotFound";
import { IStats } from "../Types/IStats";

export async function getAllStats(userId: string | null): Promise<IStats> {
  if (!userId) {
    throw new BusinessError("Bad Request", HttpStatusCode.BAD_REQUEST);
  }

  const existingUser = getUserById(userId);
  if (!existingUser) {
    throw new EntityNotFoundError("User not found", HttpStatusCode.NOT_FOUND);
  }

  const booksRead = await getBooksRead(userId);
  const favouriteGenre = await getFavouriteGenre(userId);
  const favouriteAuthor = await getFavouriteAuthor(userId);
  const readingNow = await getReadingNow(userId);
  const reviewsLeft = await getReviewsLeft(userId);
  const averageProgress = await getAverageProgress(userId);

  const stats: IStats = {
    booksRead,
    favouriteGenre,
    favouriteAuthor,
    readingNow,
    reviewsLeft,
    averageProgress,
  };

  return stats;
}

const getBooksRead = async (userId: string) => {
  const readingProgress = await getReadingProgressByUserId(userId);

  let booksRead = 0;

  for (const [key, value] of readingProgress) {
    if (value === 100) {
      booksRead++;
    }
  }

  return booksRead;
};

const getFavouriteGenre = async (userId: string) => {
  const readingProgress = await getReadingProgressByUserId(userId);

  const genreCount: { [key: string]: number } = {};

  for (const [key, value] of readingProgress) {
    if (value > 0) {
      const book = await getBookById(key);

      if (!book) {
        continue;
        throw new EntityNotFoundError(
          "Book not found",
          HttpStatusCode.NOT_FOUND
        );
      }

      if (genreCount.hasOwnProperty(book.genre)) {
        genreCount[book.genre]++;
      } else {
        genreCount[book.genre] = 1;
      }
    }
  }

  let maxCount = 0;
  let favouriteGenre = null;

  for (const genre in genreCount) {
    if (genreCount[genre] > maxCount) {
      maxCount = genreCount[genre];
      favouriteGenre = genre;
    }
  }

  return favouriteGenre;
};

const getFavouriteAuthor = async (userId: string) => {
  const readingProgress = await getReadingProgressByUserId(userId);

  const authorCount: { [key: string]: number } = {};

  for (const [key, value] of readingProgress) {
    if (value > 0) {
      const book = await getBookById(key);

      if (!book) {
        continue;
        throw new EntityNotFoundError(
          "Book not found",
          HttpStatusCode.NOT_FOUND
        );
      }

      if (authorCount.hasOwnProperty(book.author)) {
        authorCount[book.author]++;
      } else {
        authorCount[book.author] = 1;
      }
    }
  }

  let maxCount = 0;
  let favouriteAuthor = null;

  for (const author in authorCount) {
    if (authorCount[author] > maxCount) {
      maxCount = authorCount[author];
      favouriteAuthor = author;
    }
  }

  return favouriteAuthor;
};

const getReadingNow = async (userId: string) => {
  const readingProgress = await getReadingProgressByUserId(userId);

  let readingNow = 0;

  for (const [key, value] of readingProgress) {
    if (value > 0 && value < 100) {
      readingNow++;
    }
  }

  return readingNow;
};

const getReviewsLeft = async (userId: string) => {
  const reviewsArray = await getReviewsByUserId(userId);

  return reviewsArray.length;
};

const getAverageProgress = async (userId: string) => {
  const readingProgress = await getReadingProgressByUserId(userId);

  let totalProgress = 0;
  let counter = 0;
  for (const [key, value] of readingProgress) {
    totalProgress += value;
    counter++;
  }

  return totalProgress / counter;
};
