import { IncomingMessage, ServerResponse } from "http";
import { handleError } from "./GlobalErrorHandlerMiddleware";
import { IUser } from "../../Services/Types/IUser";

export const applyMiddlewares = async (
  req: IncomingMessage & { user?: IUser },
  res: ServerResponse,
  middlewares: Function[],
  finalHandler: Function
) => {
  const next = async (err?: any) => {
    if (err) {
      handleError(err, res);
      return;
    }

    const middleware = middlewares.shift();
    if (middleware) {
      try {
        await middleware(req, res, next);
      } catch (error) {
        next(error);
      }
    } else {
      try {
        await finalHandler(req, res);
      } catch (error) {
        next(error);
      }
    }
  };
  await next();
};
