import { Router } from "express";

import { login, register } from "@/controllers/auth-controller";
import validatorSchema from "@/middlewares/validator-middleware";
import { loginSchema, registerSchema } from "@/schemas/auth-schema";

const route = Router();

route.post("/auth/register", validatorSchema(registerSchema), register);
route.post("/auth/login", validatorSchema(loginSchema), login);
// route.post("/auth/refresh-token", login);

export default route;
