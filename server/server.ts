import dotenv from "dotenv";
import * as http from "http";
import mongoose from "mongoose";
import { IncomingMessage, ServerResponse } from "http";
import { applyMiddlewares } from "./WebApi/Middleware/AppMiddlewares";
import { useCors } from "./WebApi/Middleware/CorsMiddleware";
import { handleRoutes } from "./WebApi/Router/routes";

dotenv.config();

const server = http.createServer(
  async (req: IncomingMessage, res: ServerResponse) => {
    await applyMiddlewares(req, res, [useCors], handleRoutes);
  }
);

server.listen(process.env.PORT!, () =>
  console.log(`Server running on port ${process.env.PORT!}`)
);

mongoose.Promise = Promise;
mongoose.connect(process.env.MONGO_URL!);

mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});

mongoose.connection.on("error", (error: Error) => {
  console.error(error);
});
