import express from "express";
import authRoutes from "./routes/auth-route";

const app = express();
app.use(express.json());

// routes
app.use("/api", authRoutes);

export default app;
