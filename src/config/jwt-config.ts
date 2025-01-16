import { stringSchema } from "@/schemas/env-schemas";

const { JWT_PRIVATE_KEY, JWT_APP_ISSUER } = process.env;

export const PRIVATE_KEY = stringSchema.parse(JWT_PRIVATE_KEY);
export const APP_ISSUER = stringSchema.parse(JWT_APP_ISSUER);
