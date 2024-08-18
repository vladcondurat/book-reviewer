import { IncomingMessage, ServerResponse } from "http";
import { HttpStatusCode } from "../../Services/Constants/HttpStatusCodes";
import { BusinessError } from "../../Services/Exceptions/BusinessErrors";
import { isAuthenticated } from "../Middleware/AuthMiddleware";
import { isAdmin } from "../Middleware/RoleMiddleware";
import {
  USERS__BASE,
  AUTH__LOGIN,
  AUTH__REGISTER,
  POST,
  GET,
  DELETE,
  PATCH,
  ADMIN__CHANGE_ROLE,
  BOOKS__BASE,
  USERS__BOOKS,
  USERS__BOOKS_PROGRESS,
  BOOKS__ID,
  NEWS__BASE,
  STATS__BASE,
  AUTH__FORGOT_PASSWORD,
  AUTH__RESET_PASSWORD,
  CONTACT__BASE,
  SEARCH__BASE_ID,
  USERS__CURRENT,
  USERS__BOOKS_PROGRESS_ID,
  REVIEWS__BASE_ID,
  USERS__BASE_ID,
} from "./constants";
import {
  getUserHandler,
  deleteUserHandler,
  updateUserHandler,
  changeUserRoleHandler,
  addFavouriteBookHandler,
  getFavouriteBooksHandler,
  deleteFavouriteBookHandler,
  addReadingProgressHandler,
  getReadingProgressHandler,
  getCurrentUserHandler,
} from "../Controllers/UserController";
import {
  register,
  login,
  forgotPasswordHandler,
  resetPasswordHandler,
} from "../Controllers/AuthController";
import {
  createBookHandler,
  deleteBookHandler,
  getBookByIdHandler,
  getLatestBooksHandler,
  updateBookHandler,
} from "../Controllers/BookController";
import {
  addReviewHandler,
  getReviewHandler,
} from "../Controllers/ReviewController";
import { getLatestNewsHandler } from "../Controllers/NewsController";
import { sendContactMessageHandler } from "../Controllers/ContactController";
import { getStatsHandler } from "../Controllers/StatsController";
import { getSearchHandler } from "../Controllers/SearchController";
import { applyMiddlewares } from "../Middleware/AppMiddlewares";
import { getMatchedRouteKey } from "../../Services/Utils/getMatchedRouteKey";

export function handleRoutes(
  req: IncomingMessage & { user?: any },
  res: ServerResponse
) {
  const url = req.url;

  if (url) {
    const routes: {
      [key: string]: { handler: Function; middlewares: Function[] };
    } = {
      [`${POST}${USERS__BOOKS_PROGRESS_ID}`]: {
        handler: addReadingProgressHandler,
        middlewares: [isAuthenticated],
      },
      [`${GET}${USERS__BOOKS_PROGRESS_ID}`]: {
        handler: getReadingProgressHandler,
        middlewares: [isAuthenticated],
      },
      [`${POST}${USERS__BOOKS}`]: {
        handler: addFavouriteBookHandler,
        middlewares: [isAuthenticated],
      },
      [`${GET}${USERS__BOOKS}`]: {
        handler: getFavouriteBooksHandler,
        middlewares: [isAuthenticated],
      },
      [`${DELETE}${USERS__BOOKS}`]: {
        handler: deleteFavouriteBookHandler,
        middlewares: [isAuthenticated, isAdmin],
      },
      [`${POST}${AUTH__REGISTER}`]: {
        handler: register,
        middlewares: [],
      },
      [`${POST}${AUTH__LOGIN}`]: {
        handler: login,
        middlewares: [],
      },
      [`${POST}${AUTH__RESET_PASSWORD}`]: {
        handler: resetPasswordHandler,
        middlewares: [],
      },
      [`${POST}${AUTH__FORGOT_PASSWORD}`]: {
        handler: forgotPasswordHandler,
        middlewares: [],
      },
      [`${PATCH}${ADMIN__CHANGE_ROLE}`]: {
        handler: changeUserRoleHandler,
        middlewares: [isAuthenticated, isAdmin],
      },
      [`${GET}${USERS__CURRENT}`]: {
        handler: getCurrentUserHandler,
        middlewares: [isAuthenticated],
      },
      [`${DELETE}${USERS__BASE_ID}`]: {
        handler: deleteUserHandler,
        middlewares: [isAuthenticated],
      },
      [`${PATCH}${USERS__BASE}`]: {
        handler: updateUserHandler,
        middlewares: [isAuthenticated],
      },
      [`${GET}${USERS__BASE_ID}`]: {
        handler: getUserHandler,
        middlewares: [],
      },
      [`${POST}${BOOKS__BASE}`]: {
        handler: createBookHandler,
        middlewares: [isAuthenticated, isAdmin],
      },
      [`${DELETE}${BOOKS__ID}`]: {
        handler: deleteBookHandler,
        middlewares: [isAuthenticated, isAdmin],
      },
      [`${PATCH}${BOOKS__BASE}`]: {
        handler: updateBookHandler,
        middlewares: [isAuthenticated, isAdmin],
      },
      [`${GET}${BOOKS__ID}`]: {
        handler: getBookByIdHandler,
        middlewares: [],
      },
      [`${GET}${BOOKS__BASE}`]: {
        handler: getLatestBooksHandler,
        middlewares: [],
      },
      [`${POST}${REVIEWS__BASE_ID}`]: {
        handler: addReviewHandler,
        middlewares: [isAuthenticated],
      },
      [`${GET}${REVIEWS__BASE_ID}`]: {
        handler: getReviewHandler,
        middlewares: [],
      },
      [`${GET}${NEWS__BASE}`]: {
        handler: getLatestNewsHandler,
        middlewares: [],
      },
      [`${GET}${STATS__BASE}`]: {
        handler: getStatsHandler,
        middlewares: [isAuthenticated],
      },
      [`${POST}${CONTACT__BASE}`]: {
        handler: sendContactMessageHandler,
        middlewares: [],
      },
      [`${GET}${SEARCH__BASE_ID}`]: {
        handler: getSearchHandler,
        middlewares: [],
      },
    };

    const matchedRouteKey = getMatchedRouteKey(url, req, routes);

    if (matchedRouteKey) {
      const { handler, middlewares } = routes[matchedRouteKey];
      applyMiddlewares(req, res, [...middlewares], handler);
    } else {
      throw new BusinessError("Route Not Found", HttpStatusCode.NOT_FOUND);
    }
  } else {
    throw new BusinessError(
      "Bad Request: Request URL is missing",
      HttpStatusCode.BAD_REQUEST
    );
  }
}
