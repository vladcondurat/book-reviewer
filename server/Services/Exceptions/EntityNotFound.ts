import { HttpStatusCode } from "../Constants/HttpStatusCodes";
import { BaseError } from "./BaseError";

export class EntityNotFoundError extends BaseError {
  constructor(description: string, httpCode: HttpStatusCode) {
    super("ENTITY_NOT_FOUND", httpCode, true, description);
  }
}
