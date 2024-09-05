import z from "zod";
import { registerSchema } from "./schemas/auth-schema";

export type RegisterAuthType = z.infer<typeof registerSchema>;
