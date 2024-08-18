import { HttpStatusCode } from "../../Services/Constants/HttpStatusCodes";
import { IncomingMessage, ServerResponse } from "http";
import { getRequestBody } from "../../Services/Utils/GetRequestBody";
import { sendResponse } from "../../Services/Utils/SendResponse";
import { getIdFromUrl } from "../../Services/Utils/GetIdFromUrl";
import { addReview, getReviews } from "../../Services/Features/ReviewService";
import { getCurrentUserId } from "../../Services/Utils/GetCurrentUserId";

export async function addReviewHandler(
  req: IncomingMessage,
  res: ServerResponse
): Promise<void> {
  const userId = await getCurrentUserId(req);
  const bookId = getIdFromUrl(req.url!);
  const body = await getRequestBody(req);
  const book = await addReview(userId, bookId, JSON.parse(body));

  sendResponse(res, HttpStatusCode.CREATED, book);
}

export async function getReviewHandler(
  req: IncomingMessage,
  res: ServerResponse
): Promise<void> {
  const bookId = getIdFromUrl(req.url!);
  const reviews = await getReviews(bookId);

  sendResponse(res, HttpStatusCode.OK, reviews);
}
