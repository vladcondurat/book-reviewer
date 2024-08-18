import { IncomingMessage, ServerResponse } from "http";
import { AuthError } from "../../Services/Exceptions/AuthErrors";
import { HttpStatusCode } from "../../Services/Constants/HttpStatusCodes";
import { getCurrentUserRole } from "../../Services/Utils/GetCurrentUserRole";
import { UserRole } from "../../Data/Constants/UserRole";

export const isAdmin = async (
  req: IncomingMessage & { user?: any },
  res: ServerResponse,
  next: (err?: any) => void
) => {
  try {
    const currentUserRole = await getCurrentUserRole(req);

    if (currentUserRole !== UserRole.ADMIN) {
      return next(new AuthError("Forbidden", HttpStatusCode.FORBIDDEN));
    }

    next();
  } catch (error) {
    next(error);
  }
};
