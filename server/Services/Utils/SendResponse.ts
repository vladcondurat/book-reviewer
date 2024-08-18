import { ServerResponse } from "http";

function sendResponse(res: ServerResponse, statusCode: number, data?: any) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json");
  if (data) {
    res.end(JSON.stringify(data));
  } else {
    res.end();
  }
}

export { sendResponse };
