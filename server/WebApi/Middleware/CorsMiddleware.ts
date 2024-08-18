import { IncomingMessage, ServerResponse } from "http";

export const useCors = (
  req: IncomingMessage,
  res: ServerResponse,
  next: () => void
) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
  } else {
    next();
  }
};
