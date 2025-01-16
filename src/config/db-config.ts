import { dbUrlSchema } from "@/schemas/env-schemas";

export const DB_URL = dbUrlSchema.parse(process.env.DB_URL);
