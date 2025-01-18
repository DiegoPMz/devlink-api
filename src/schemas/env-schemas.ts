import z from "zod";

export const numberSchema = z.number();
export const stringSchema = z.string().trim();
export const dbUrlSchema = z.string().refine(
  (value) => {
    // Regex para validar la URL MongoDB + SRV
    const regex = /^mongodb\+srv:\/\/([^:]+):([^@]+)@([^\/]+)\/\?(.+)$/;
    return regex.test(value);
  },
  {
    message: "Invalid MongoDB connection string format",
  },
);
