import { HttpStatusCode } from "../../Services/Constants/HttpStatusCodes";
import { IncomingMessage, ServerResponse } from "http";
import { getRequestBody } from "../../Services/Utils/GetRequestBody";
import { sendResponse } from "../../Services/Utils/SendResponse";
import { sendEmail } from "../../Services/Features/EmailService";
import { getCurrentUserId } from "../../Services/Utils/GetCurrentUserId";

export async function sendContactMessageHandler(
  req: IncomingMessage,
  res: ServerResponse
): Promise<void> {
  const body = await getRequestBody(req);
  const { content, email } = JSON.parse(body);

  await sendEmail(email, content);
  sendResponse(res, HttpStatusCode.NO_CONTENT);
}
