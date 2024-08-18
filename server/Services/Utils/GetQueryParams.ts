import { IncomingMessage } from "http";

export function getQueryParams(req: IncomingMessage): URLSearchParams {
  const url = new URL(req.url!, `http://${req.headers.host}`);
  const queryParams = url.searchParams;
  return queryParams;
}
