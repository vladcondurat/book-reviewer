import { ServerResponse } from "http";

interface CookieOptions {
  expires?: Date;
  path?: string;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: "Strict" | "Lax" | "None";
}

export function setCookie(
  res: ServerResponse,
  name: string,
  value: string,
  options: CookieOptions = {}
) {
  let cookie = `${name}=${value}`;

  if (options.expires) {
    cookie += `; Expires=${options.expires.toUTCString()}`;
  }

  if (options.path) {
    cookie += `; Path=${options.path}`;
  }

  if (options.httpOnly) {
    cookie += `; HttpOnly`;
  }

  if (options.sameSite === "None" && !options.secure) {
    options.secure = true;
  }

  if (options.secure) {
    cookie += `; Secure`;
  }

  if (options.sameSite) {
    cookie += `; SameSite=${options.sameSite}`;
  }

  res.setHeader("Set-Cookie", cookie);
}
