import { IncomingMessage } from "http";

export function getMatchedRouteKey(
  url: string,
  req: IncomingMessage,
  routes: { [key: string]: { handler: Function; middlewares: Function[] } }
): string | undefined {
  let matchedRouteKey: string | undefined;

  matchedRouteKey = Object.keys(routes).find(
    (routeKey) => routeKey === `${req.method}${url}`
  );

  if (!matchedRouteKey) {
    matchedRouteKey = Object.keys(routes).find((routeKey) =>
      matchRoute(url, routeKey, req.method!)
    );
  }

  return matchedRouteKey;
}

function matchRoute(url: string, pattern: string, method: string): boolean {
  const strippedUrl = url.split("?")[0].slice(1);
  const urlParts = strippedUrl.split("/");
  const patternParts = pattern.split("/");

  if (!pattern.startsWith(method)) return false;

  const methodlessPatternParts = patternParts.slice(1);
  if (urlParts.length !== methodlessPatternParts.length) return false;

  return methodlessPatternParts.every((part, index) => {
    return part.startsWith(":") || part === urlParts[index];
  });
}
