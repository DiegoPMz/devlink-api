import cookieParser from "cookie-parser";
import express from "express";
import morgan from "morgan";
import errorHandler from "./middlewares/errorHandler-middleware";
import authRoutes from "./routes/auth-route";
import templateRoutes from "./routes/template-register-route";

const app = express();
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

const API_V1 = "/api/devlink";
// routes
app.use(API_V1, authRoutes);
app.use(API_V1, templateRoutes);

// error handler
app.use(errorHandler);

export default app;
