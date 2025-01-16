import { numberSchema, stringSchema } from "@/schemas/env-schemas";

const { API_PORT, FRONTEND_CORS } = process.env;

export const BACKEND_PORT = numberSchema.parse(Number(API_PORT));
export const APP_CORS = stringSchema.parse(FRONTEND_CORS);
