import { BusinessError } from "../Exceptions/BusinessErrors";
import { HttpStatusCode } from "../Constants/HttpStatusCodes";
import {
  deleteBookById,
  getBookById,
  createBook,
  getBooks,
  getBooksScienceFiction,
  getBooksComedy,
  getBooksHorror,
  getBooksClassics,
  getBooksRomance,
} from "../../Data/Repositories/BookRepository";
import { EntityNotFoundError } from "../Exceptions/EntityNotFound";
import { IBook } from "../Types/IBook";

export async function addBook(bookData: IBook): Promise<IBook> {
  const {
    title,
    description,
    author,
    genre,
    publishingHouse,
    bookCoverImage,
    edition,
    year,
  } = bookData;
  if (
    !title ||
    !description ||
    !author ||
    !genre ||
    !publishingHouse ||
    !bookCoverImage ||
    !edition ||
    !year
  ) {
    throw new BusinessError(
      "Bad Request: Missing one or more required fields",
      HttpStatusCode.BAD_REQUEST
    );
  }
  const newBook = await createBook(bookData);
  return newBook;
}

export async function getLatestBooks(filter: string): Promise<IBook[]> {
  let books;

  if (filter === "science-fiction") {
    books = getBooksScienceFiction();
  } else if (filter === "comedy") {
    books = getBooksComedy();
  } else if (filter === "horror") {
    books = getBooksHorror();
  } else if (filter === "classics") {
    books = getBooksClassics();
  } else if (filter === "romance") {
    books = getBooksRomance();
  } else {
    books = getBooks();
  }

  return books;
}

export async function updateBook(
  id: string | null,
  bookData: Partial<IBook>
): Promise<IBook> {
  if (!id) {
    throw new BusinessError("Bad Request", HttpStatusCode.BAD_REQUEST);
  }

  const book = await getBookById(id);

  if (!book) {
    throw new EntityNotFoundError("Book not found", HttpStatusCode.NOT_FOUND);
  }

  const hasUpdates = Object.values(bookData).some(
    (value) => value !== undefined
  );

  if (!hasUpdates) {
    throw new BusinessError(
      "Bad Request: No fields to update",
      HttpStatusCode.BAD_REQUEST
    );
  }

  for (const [key, value] of Object.entries(bookData)) {
    if (value !== undefined) {
      if (!(key in book)) {
        throw new BusinessError(
          `Invalid field: ${key}`,
          HttpStatusCode.BAD_REQUEST
        );
      }
      (book as Partial<IBook>)[key] = value;
    }
  }

  await book.save();
  return book;
}

export async function deleteBook(id: string | null): Promise<void> {
  if (!id) {
    throw new BusinessError("Bad Request", HttpStatusCode.BAD_REQUEST);
  }

  await deleteBookById(id);
}
