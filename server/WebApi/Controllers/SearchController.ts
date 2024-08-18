import { IncomingMessage, ServerResponse } from "http";
import { HttpStatusCode } from "../../Services/Constants/HttpStatusCodes";
import { sendResponse } from "../../Services/Utils/SendResponse";
import { getCurrentUserId } from "../../Services/Utils/GetCurrentUserId";
import { getSearchResults } from "../../Services/Features/SearchService";
import { getIdFromUrl } from "../../Services/Utils/GetIdFromUrl";
import { getQueryParams } from "../../Services/Utils/GetQueryParams";

export const getSearchHandler = async (
  req: IncomingMessage,
  res: ServerResponse
): Promise<void> => {
  const params = getQueryParams(req);

  const searchResults = await getSearchResults(params.get("search-input")!);

  sendResponse(res, HttpStatusCode.OK, searchResults);
};
