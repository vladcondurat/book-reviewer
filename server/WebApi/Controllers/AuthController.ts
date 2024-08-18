import { HttpStatusCode } from "../../Services/Constants/HttpStatusCodes";
import { IncomingMessage, ServerResponse } from "http";
import { getRequestBody } from "../../Services/Utils/GetRequestBody";
import { setCookie } from "../../Services/Utils/SetCookie";
import { sendResponse } from "../../Services/Utils/SendResponse";
import {
  registerUser,
  loginUser,
  getResetToken,
  resetPassword,
} from "../../Services/Features/AuthService";
import { sendPasswordRecoveryEmail } from "../../Services/Features/EmailService";

export async function register(
  req: IncomingMessage,
  res: ServerResponse
): Promise<void> {
  const body = await getRequestBody(req);
  const user = await registerUser(JSON.parse(body));

  sendResponse(res, HttpStatusCode.CREATED, user);
}

export async function login(
  req: IncomingMessage,
  res: ServerResponse
): Promise<void> {
  const body = await getRequestBody(req);
  const user = await loginUser(JSON.parse(body));

  setCookie(res, "Auth", user.authentification.sessionToken, {
    expires: new Date(Date.now() + 3600000),
    path: "/",
    httpOnly: true,
    secure: false,
    sameSite: "None",
  });

  sendResponse(res, HttpStatusCode.NO_CONTENT);
}

export async function forgotPasswordHandler(
  req: IncomingMessage,
  res: ServerResponse
): Promise<void> {
  const body = await getRequestBody(req);
  const { email } = JSON.parse(body);
  var token = await getResetToken(email);
  await sendPasswordRecoveryEmail(email, token);

  sendResponse(res, HttpStatusCode.NO_CONTENT);
}

export async function resetPasswordHandler(
  req: IncomingMessage,
  res: ServerResponse
): Promise<void> {
  const body = await getRequestBody(req);
  const { token, newPassword } = JSON.parse(body);
  await resetPassword(token, newPassword);

  sendResponse(res, HttpStatusCode.NO_CONTENT);
}
