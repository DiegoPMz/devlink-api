import createErrorResponseApp from "@/utils/error-response-app";
import handleErrorSchema from "@/utils/handle-error-schemas";
import { NextFunction, Request, Response } from "express";
import z from "zod";

const validatorSchema =
  <T>(schema: z.ZodType<T>) =>
  (req: Request, res: Response, next: NextFunction) => {
    const validation = schema.safeParse(req.body);

    if (!validation.success || validation.error) {
      const formattedErrors = handleErrorSchema(validation.error.errors);
      return res.status(400).json(createErrorResponseApp(400, formattedErrors));
    }

    return next();
  };

export default validatorSchema;
