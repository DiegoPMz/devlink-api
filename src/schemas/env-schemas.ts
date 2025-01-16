import z from "zod";

export const numberSchema = z.number();
export const stringSchema = z.string().trim();
export const dbUrlSchema = z.string().refine(
  (url) => {
    try {
      const parsedUrl = new URL(url);
      return ["mongodb:"].includes(parsedUrl.protocol);
    } catch {
      return false;
    }
  },
  {
    message: "Invalid database URL. Supported protocols: mongodb",
  },
);
