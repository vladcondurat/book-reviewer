import { getUserBySessionToken } from "../../Data/Repositories/UserRepository";
import { IncomingMessage, ServerResponse } from "http";
import { HttpStatusCode } from "../../Services/Constants/HttpStatusCodes";
import { AuthError } from "../../Services/Exceptions/AuthErrors";
import { merge } from "../../Services/Utils/MergeReq";

export const isAuthenticated = async (
  req: IncomingMessage & { user?: any },
  res: ServerResponse,
  next: (err?: any) => void
) => {
  const cookieHeader = req.headers.cookie;
  let sessionToken;
  if (cookieHeader) {
    const cookies = cookieHeader.split(";");
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split("=");
      if (name === "Auth") {
        sessionToken = value;
        break;
      }
    }
  }

  if (!sessionToken) {
    throw new AuthError("Forbidden", HttpStatusCode.FORBIDDEN);
  }

  const existingUser = await getUserBySessionToken(sessionToken as string);
  if (!existingUser) {
    throw new AuthError("Forbidden", HttpStatusCode.FORBIDDEN);
  }

  merge(req, { user: existingUser });
  next();
};
