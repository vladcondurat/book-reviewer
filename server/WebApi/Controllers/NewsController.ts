import { HttpStatusCode } from "../../Services/Constants/HttpStatusCodes";
import { IncomingMessage, ServerResponse } from "http";
import { sendResponse } from "../../Services/Utils/SendResponse";
import { getLatestNews } from "../../Services/Features/NewsService";

export async function getLatestNewsHandler(
  req: IncomingMessage,
  res: ServerResponse
): Promise<void> {
  const news = await getLatestNews();

  sendResponse(res, HttpStatusCode.OK, news);
}
