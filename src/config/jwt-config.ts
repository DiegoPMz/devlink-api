import dotenv from "dotenv";
dotenv.config();

export const PRIVATE_KEY = process.env.JWT_PRIVATE_KEY as string;
export const APP_ISSUER = process.env.JWT_APP_ISSUER as string;
