import { HttpStatusCode } from "../../Services/Constants/HttpStatusCodes";
import { BaseError } from "../../Services/Exceptions/BaseError";
import { ServerResponse } from "http";
import { sendResponse } from "../../Services/Utils/SendResponse";

export const handleError = async (
  err: Error,
  res: ServerResponse
): Promise<void> => {
  if (isTrustedError(err)) {
    sendResponse(res, (err as BaseError).httpCode, {
      message: err.message,
      type: err.name,
    });
  } else {
    sendResponse(res, HttpStatusCode.INTERNAL_SERVER, {
      message: "Unhandeled Server Error",
      error: err.message,
    });
  }
};

const isTrustedError = (error: Error) => {
  if (error instanceof BaseError) {
    return error.isOperational;
  }
  return false;
};
