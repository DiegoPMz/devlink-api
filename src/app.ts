import dotenv from "dotenv";
dotenv.config();

import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import morgan from "morgan";
import { APP_CORS } from "./config";
import errorHandler from "./middlewares/errorHandler-middleware";
import authRoutes from "./routes/auth-route";
import templateRoutes from "./routes/template-route";

const app = express();
app.use(
  cors({
    origin: [APP_CORS],
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

// routes
const API_V1 = "/api/devlink";
app.use(API_V1, authRoutes);
app.use(API_V1, templateRoutes);

// error handler
app.use(errorHandler);

export default app;
