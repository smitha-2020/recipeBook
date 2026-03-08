import express, { Response, Request } from "express";
import config from "config";
import mongoose from "mongoose";

import { IConfigDTO } from "./dto/configDTO.js";

import genreRoute from "./routes/genre.js";
import authRoute from "./routes/auth.js";
import { StatusCodes } from "http-status-codes";
import errorMiddleWare from "./middleware/error.js";

const app = express();
const dbConfig = config.get<IConfigDTO>("dbConfig");

if (!config.get("privateKey")) {
  console.log("FATAL:Private key not found");
  process.exit(1);
}

mongoose
  .connect(`mongodb://${dbConfig.host}:${dbConfig.port}/${dbConfig.dbName}`)
  .then(() => {
    console.log(`Connected to MongoDB ${dbConfig.dbName}`);
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err.message);
  });

app.use(express.json());
app.use("/api/genre", genreRoute);
//app.use("/api/movies", movieRoute);
//app.use("/api/customers", customerRoute);
//app.use("/api/register", userRoute);
app.use("/api/auth", authRoute);
app.use(errorMiddleWare);

app.use((req: Request, res: Response) => {
  res.status(StatusCodes.NOT_FOUND).json({
    error: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
