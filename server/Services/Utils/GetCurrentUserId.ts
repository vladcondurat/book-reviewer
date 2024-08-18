import { IncomingMessage } from "http";
import { getUserBySessionToken } from "../../Data/Repositories/UserRepository";
import { AuthError } from "../Exceptions/AuthErrors";
import { HttpStatusCode } from "../Constants/HttpStatusCodes";
import { BusinessError } from "../Exceptions/BusinessErrors";

export async function getCurrentUserId(
  req: IncomingMessage
): Promise<string | null> {
  const cookieHeader = req.headers.cookie;
  let sessionToken;

  if (cookieHeader) {
    const cookies = cookieHeader.split(";").map((cookie) => cookie.trim());
    for (const cookie of cookies) {
      const [name, value] = cookie.split("=");
      if (name === "Auth") {
        sessionToken = value;
        break;
      }
    }
  }

  if (!sessionToken) {
    throw new AuthError("Forbidden", HttpStatusCode.FORBIDDEN);
  }

  const user = await getUserBySessionToken(sessionToken);

  if (!user) {
    throw new BusinessError("User not found", HttpStatusCode.NOT_FOUND);
  }

  return user._id.toString();
}
