import { BusinessError } from "../Exceptions/BusinessErrors";
import { HttpStatusCode } from "../Constants/HttpStatusCodes";
import {
  deleteUserById,
  getUserById,
  addOrUpdateReadingProgress,
  getReadingProgressByBookId,
  getUserByEmailAddress,
} from "../../Data/Repositories/UserRepository";
import {
  addFavouriteBookByBookId,
  deleteFavouriteBookByBookId,
  getBookById,
  getFavouriteBooksByUserId,
} from "../../Data/Repositories/BookRepository";
import { createNews } from "./NewsService";
import { NewsTypes } from "../../Data/Constants/NewsTypes";
import { EntityNotFoundError } from "../Exceptions/EntityNotFound";
import { IUser } from "../Types/IUser";

export async function getUser(userId: string | null): Promise<IUser> {
  if (!userId) {
    throw new BusinessError("Bad Request", HttpStatusCode.BAD_REQUEST);
  }
  const existingUser = await getUserById(userId);
  if (!existingUser) {
    throw new EntityNotFoundError("User not found", HttpStatusCode.NOT_FOUND);
  }
  return existingUser;
}

export async function getUserByEmail(email: string): Promise<IUser> {
  if (!email) {
    throw new BusinessError("Bad Request", HttpStatusCode.BAD_REQUEST);
  }
  const existingUser = await getUserByEmailAddress(email);
  if (!existingUser) {
    throw new EntityNotFoundError("User not found", HttpStatusCode.NOT_FOUND);
  }
  return existingUser;
}

export async function updateUser(
  id: string | null,
  userData: Partial<IUser>
): Promise<IUser> {
  if (!id) {
    throw new BusinessError("Bad Request", HttpStatusCode.BAD_REQUEST);
  }

  const hasUpdates = Object.values(userData).some(
    (value) => value !== undefined
  );

  if (!hasUpdates) {
    throw new BusinessError(
      "Bad Request: No fields to update",
      HttpStatusCode.BAD_REQUEST
    );
  }

  const user = await getUserById(id);
  if (!user) {
    throw new EntityNotFoundError("User not found", HttpStatusCode.NOT_FOUND);
  }

  for (const [key, value] of Object.entries(userData)) {
    if (value !== undefined) {
      if (!(key in user)) {
        throw new BusinessError(
          `Invalid field: ${key}`,
          HttpStatusCode.BAD_REQUEST
        );
      }
      (user as Partial<IUser>)[key] = value;
    }
  }

  await user.save();
  return user;
}

export async function deleteUser(id: string | null): Promise<void> {
  if (!id) {
    throw new BusinessError("Bad Request", HttpStatusCode.BAD_REQUEST);
  }

  const existingUser = await getUserById(id);
  if (!existingUser) {
    throw new EntityNotFoundError("User not found", HttpStatusCode.NOT_FOUND);
  }

  await deleteUserById(id);
}

export async function changeUserRole(id: string, role: string): Promise<void> {
  if (!id || !role) {
    throw new BusinessError("Bad Request", HttpStatusCode.BAD_REQUEST);
  }

  const user = await getUserById(id);

  if (!user) {
    throw new EntityNotFoundError("User not found", HttpStatusCode.NOT_FOUND);
  }

  user.role = role;

  await user.save();
}

export async function addFavouriteBook(
  userId: string | null,
  bookId: string
): Promise<void> {
  if (!userId || !bookId) {
    throw new BusinessError("Bad Request", HttpStatusCode.BAD_REQUEST);
  }

  const user = await getUserById(userId);

  if (!user) {
    throw new EntityNotFoundError("User not found", HttpStatusCode.NOT_FOUND);
  }

  const book = await getBookById(bookId);

  if (!book) {
    throw new EntityNotFoundError("Book not found", HttpStatusCode.NOT_FOUND);
  }

  const existingFavouriteBooks = await getFavouriteBooksByUserId(userId);
  if (existingFavouriteBooks.includes(bookId)) {
    throw new BusinessError(
      "Book already in favourites",
      HttpStatusCode.BAD_REQUEST
    );
  }

  addFavouriteBookByBookId(userId, bookId);
  await user.save();
}

export async function getFavouriteBooks(
  userId: string | null
): Promise<string[]> {
  if (!userId) {
    throw new BusinessError("Bad Request", HttpStatusCode.BAD_REQUEST);
  }

  const user = await getUserById(userId);

  if (!user) {
    throw new EntityNotFoundError("User not found", HttpStatusCode.NOT_FOUND);
  }

  const favouriteBooks = await getFavouriteBooksByUserId(userId);

  return favouriteBooks;
}

export async function deleteFavouriteBook(
  userId: string | null,
  bookId: string
): Promise<void> {
  if (!userId || !bookId) {
    throw new BusinessError("Bad Request", HttpStatusCode.BAD_REQUEST);
  }

  const user = await getUserById(userId);

  if (!user) {
    throw new EntityNotFoundError("User not found", HttpStatusCode.NOT_FOUND);
  }

  const bookIndex = user.favouriteBooks.indexOf(bookId);

  if (bookIndex === -1) {
    throw new EntityNotFoundError("Book not found", HttpStatusCode.NOT_FOUND);
  }

  await deleteFavouriteBookByBookId(userId, bookId);

  await user.save();
}

export async function getReadingProgress(
  userId: string | null,
  bookId: string
): Promise<number> {
  if (!userId || !bookId) {
    throw new BusinessError("Bad Request", HttpStatusCode.BAD_REQUEST);
  }

  let readingProgress = await getReadingProgressByBookId(userId, bookId);

  if (!readingProgress) {
    readingProgress = -1;
  }

  return readingProgress;
}

export async function addReadingProgress(
  userId: string | null,
  bookId: string,
  progress: number
): Promise<void> {
  if (!userId || !bookId || !progress) {
    throw new BusinessError("Bad Request", HttpStatusCode.BAD_REQUEST);
  }

  const user = await getUserById(userId);

  if (!user) {
    throw new EntityNotFoundError("User not found", HttpStatusCode.NOT_FOUND);
  }

  if (progress < 0 || progress > 100) {
    throw new BusinessError("Bad Request", HttpStatusCode.BAD_REQUEST);
  }

  const previousProgress =
    (await getReadingProgressByBookId(userId, bookId)) || 0;

  if (progress < previousProgress) {
    throw new BusinessError(
      "New progress must be greater than previous progress",
      HttpStatusCode.BAD_REQUEST
    );
  }

  if (previousProgress == 0) {
    createNews(userId, NewsTypes.STARTED_READING, bookId);
  }

  await addOrUpdateReadingProgress(userId, bookId, progress);

  await user.save();
}
