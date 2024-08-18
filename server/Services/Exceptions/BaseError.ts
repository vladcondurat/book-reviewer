const { HttpStatusCode } = require("../Constants/HttpStatusCodes");

export class BaseError extends Error {
  public readonly name: string;
  public readonly httpCode: typeof HttpStatusCode;
  public readonly isOperational: boolean;

  constructor(
    name: string,
    httpCode: typeof HttpStatusCode,
    isOperational: boolean,
    description: string
  ) {
    super(description);
    Object.setPrototypeOf(this, new.target.prototype);

    this.name = name;
    this.httpCode = httpCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this);
  }
}
