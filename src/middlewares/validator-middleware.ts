import { NextFunction, Request, Response } from "express";
import z from "zod";

const validatorSchema =
  <T>(schema: z.ZodType<T>) =>
  (req: Request, res: Response, next: NextFunction) => {
    const validation = schema.safeParse(req.body);

    if (!validation.success || validation.error) {
      return res.status(400).json(validation.error.format());
    }

    return next();
  };

export default validatorSchema;
