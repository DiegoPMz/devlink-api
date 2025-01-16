import { stringSchema } from "@/schemas/env-schemas";

const { CLOUD_STORAGE_NAME, CLOUD_STORAGE_API_KEY, CLOUD_STORAGE_API_SECRET } =
  process.env;

export const CLOUD_NAME = stringSchema.parse(CLOUD_STORAGE_NAME);
export const API_KEY = stringSchema.parse(CLOUD_STORAGE_API_KEY);
export const API_SECRET = stringSchema.parse(CLOUD_STORAGE_API_SECRET);
export const STORE_FOLDER = "devlink";
