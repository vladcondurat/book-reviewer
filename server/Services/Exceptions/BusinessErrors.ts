import { HttpStatusCode } from "../Constants/HttpStatusCodes";
import { BaseError } from "./BaseError";

export class BusinessError extends BaseError {
  constructor(description: string, httpCode: HttpStatusCode) {
    super("BUSINESS_ERROR", httpCode, true, description);
  }
}
