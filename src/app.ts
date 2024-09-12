import cookieParser from "cookie-parser";
import express from "express";
import authRoutes from "./routes/auth-route";
import templateRoutes from "./routes/template-register-route";

const app = express();
app.use(express.json());
app.use(cookieParser());

// routes
app.use("/api/devlink", authRoutes);
app.use("/api/devlink", templateRoutes);

export default app;
