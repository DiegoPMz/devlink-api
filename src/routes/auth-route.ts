import { Router } from "express";

import { login, register } from "@/controllers/auth-controller";
import validatorSchema from "@/middlewares/validator-middleware";
import { loginSchema, registerSchema } from "@/schemas/auth-schema";

const route = Router();

route.post("/register", validatorSchema(registerSchema), register);
route.post("/login", validatorSchema(loginSchema), login);

export default route;
