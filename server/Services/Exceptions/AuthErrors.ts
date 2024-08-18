import { HttpStatusCode } from "../Constants/HttpStatusCodes";
import { BaseError } from "./BaseError";

export class AuthError extends BaseError {
  constructor(description: string, httpCode: HttpStatusCode) {
    super("AUTH_ERROR", httpCode, true, description);
  }
}
