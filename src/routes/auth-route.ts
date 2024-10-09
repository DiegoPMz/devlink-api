import { Router } from "express";

import {
  login,
  logout,
  refreshToken,
  register,
} from "@/controllers/auth-controller";
import validatorSchema from "@/middlewares/validator-middleware";
import verifyToken from "@/middlewares/verifyToken-middleware";
import { loginSchema, registerSchema } from "@/schemas/auth-schema";

const route = Router();
route.post("/auth/register", validatorSchema(registerSchema), register);
route.post("/auth/login", validatorSchema(loginSchema), login);
route.get("/auth/logout", verifyToken, logout);
route.get("/auth/refresh-token", refreshToken);

export default route;
