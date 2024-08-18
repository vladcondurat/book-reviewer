import { HttpStatusCode } from "../../Services/Constants/HttpStatusCodes";
import { IncomingMessage, ServerResponse } from "http";
import { getRequestBody } from "../../Services/Utils/GetRequestBody";
import { sendResponse } from "../../Services/Utils/SendResponse";
import {
  addBook,
  deleteBook,
  getLatestBooks,
  updateBook,
} from "../../Services/Features/BookService";
import { getIdFromUrl } from "../../Services/Utils/GetIdFromUrl";
import { getBookById } from "../../Data/Repositories/BookRepository";
import { getQueryParams } from "../../Services/Utils/GetQueryParams";
import { getCurrentUserId } from "../../Services/Utils/GetCurrentUserId";
import { createNews } from "../../Services/Features/NewsService";
import { NewsTypes } from "../../Data/Constants/NewsTypes";

export async function createBookHandler(
  req: IncomingMessage,
  res: ServerResponse
): Promise<void> {
  const body = await getRequestBody(req);
  const book = await addBook(JSON.parse(body));
  const id = await getCurrentUserId(req);
  createNews(id, NewsTypes.ADDED_NEW_BOOK, book.id);

  sendResponse(res, HttpStatusCode.CREATED);
}

export async function deleteBookHandler(
  req: IncomingMessage,
  res: ServerResponse
): Promise<void> {
  const id = await getIdFromUrl(req.url!);
  await deleteBook(id);

  sendResponse(res, HttpStatusCode.NO_CONTENT);
}

export async function updateBookHandler(
  req: IncomingMessage,
  res: ServerResponse
): Promise<void> {
  const id = await getCurrentUserId(req);
  const body = await getIdFromUrl(req.url!);
  const book = await updateBook(id, JSON.parse(body));

  sendResponse(res, HttpStatusCode.OK, book);
}

export const getBookByIdHandler = async (
  req: IncomingMessage,
  res: ServerResponse
): Promise<void> => {
  const id = getIdFromUrl(req.url!);
  const book = await getBookById(id);

  sendResponse(res, HttpStatusCode.OK, book);
};

export const getLatestBooksHandler = async (
  req: IncomingMessage,
  res: ServerResponse
): Promise<void> => {
  const queryParams = getQueryParams(req);
  const books = await getLatestBooks(queryParams.get("filter")!);
  const start = parseInt(queryParams.get("start") || "0");
  const end = parseInt(queryParams.get("end") || books.length.toString());
  const latestBooks = books.slice(start, end);

  sendResponse(res, HttpStatusCode.OK, latestBooks);
};
