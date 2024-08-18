import { HttpStatusCode } from "../../Services/Constants/HttpStatusCodes";
import { IncomingMessage, ServerResponse } from "http";
import { getRequestBody } from "../../Services/Utils/GetRequestBody";
import { sendResponse } from "../../Services/Utils/SendResponse";
import {
  deleteUser,
  updateUser,
  changeUserRole,
  addFavouriteBook,
  getFavouriteBooks,
  deleteFavouriteBook,
  addReadingProgress,
  getReadingProgress,
  getUser,
} from "../../Services/Features/UserService";
import { getIdFromUrl } from "../../Services/Utils/GetIdFromUrl";
import { getQueryParams } from "../../Services/Utils/GetQueryParams";
import { getCurrentUserId } from "../../Services/Utils/GetCurrentUserId";

export async function deleteUserHandler(
  req: IncomingMessage,
  res: ServerResponse
): Promise<void> {
  const id = await getCurrentUserId(req);
  await deleteUser(id);

  sendResponse(res, HttpStatusCode.NO_CONTENT);
}

export async function updateUserHandler(
  req: IncomingMessage,
  res: ServerResponse
): Promise<void> {
  const id = await getCurrentUserId(req);
  const body = await getRequestBody(req);
  const user = await updateUser(id, JSON.parse(body));

  sendResponse(res, HttpStatusCode.OK, user);
}

export const getUserHandler = async (
  req: IncomingMessage,
  res: ServerResponse
): Promise<void> => {
  const userId = getIdFromUrl(req.url!);
  const user = await getUser(userId);

  sendResponse(res, HttpStatusCode.OK, user);
};

export const getCurrentUserHandler = async (
  req: IncomingMessage,
  res: ServerResponse
): Promise<void> => {
  const userId = await getCurrentUserId(req);
  const user = await getUser(userId);

  sendResponse(res, HttpStatusCode.OK, user);
};

export async function changeUserRoleHandler(
  req: IncomingMessage,
  res: ServerResponse
): Promise<void> {
  const id = getIdFromUrl(req.url!);
  const body = await getRequestBody(req);
  const { role } = JSON.parse(body);
  await changeUserRole(id, JSON.parse(body));

  sendResponse(res, HttpStatusCode.NO_CONTENT);
}

export async function addFavouriteBookHandler(
  req: IncomingMessage,
  res: ServerResponse
): Promise<void> {
  const id = await getCurrentUserId(req);
  const body = await getRequestBody(req);
  const { bookId } = JSON.parse(body);
  await addFavouriteBook(id, bookId);

  sendResponse(res, HttpStatusCode.NO_CONTENT);
}

export async function getFavouriteBooksHandler(
  req: IncomingMessage,
  res: ServerResponse
): Promise<void> {
  const id = await getCurrentUserId(req);
  const queryParams = getQueryParams(req);
  const books = await getFavouriteBooks(id);
  const start = parseInt(queryParams.get("start") || "0");
  const end = parseInt(queryParams.get("end") || books.length.toString());
  const favouriteBooks = books.slice(start, end);

  sendResponse(res, HttpStatusCode.OK, favouriteBooks);
}

export async function deleteFavouriteBookHandler(
  req: IncomingMessage,
  res: ServerResponse
): Promise<void> {
  const id = await getCurrentUserId(req);
  const body = await getRequestBody(req);
  const { bookId } = JSON.parse(body);
  await deleteFavouriteBook(id, bookId);

  sendResponse(res, HttpStatusCode.NO_CONTENT);
}

export async function addReadingProgressHandler(
  req: IncomingMessage,
  res: ServerResponse
): Promise<void> {
  const id = await getCurrentUserId(req);
  const body = await getRequestBody(req);
  const { bookId, progress } = JSON.parse(body);
  await addReadingProgress(id, bookId, progress);

  sendResponse(res, HttpStatusCode.NO_CONTENT);
}

export async function getReadingProgressHandler(
  req: IncomingMessage,
  res: ServerResponse
): Promise<void> {
  const userId = await getCurrentUserId(req);
  const bookId = getIdFromUrl(req.url!);
  const readingProgress = await getReadingProgress(userId, bookId);

  sendResponse(res, HttpStatusCode.OK, readingProgress);
}
