import { IncomingMessage, ServerResponse } from "http";
import { HttpStatusCode } from "../../Services/Constants/HttpStatusCodes";
import { sendResponse } from "../../Services/Utils/SendResponse";
import { getAllStats } from "../../Services/Features/StatsService";
import { getCurrentUserId } from "../../Services/Utils/GetCurrentUserId";

export const getStatsHandler = async (
  req: IncomingMessage,
  res: ServerResponse
): Promise<void> => {
  const userId = await getCurrentUserId(req);
  const stats = await getAllStats(userId);

  sendResponse(res, HttpStatusCode.OK, stats);
};
