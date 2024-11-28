import { ClientError } from "@/utils/customErrors";
import createErrorResponseApp from "@/utils/error-response-app";
import { Request, Response } from "express";
import { MulterError } from "multer";

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _: unknown,
) => {
  if (err instanceof ClientError) {
    return res.status(err.status).json(
      createErrorResponseApp(err.status, {
        [err.field]: err.message,
      }),
    );
  }

  if (err instanceof MulterError) {
    return res.status(400).json(
      createErrorResponseApp(400, {
        [err.field ?? "service"]: err.message,
      }),
    );
  }

  return res.status(500).json(
    createErrorResponseApp(500, {
      service: "Something went wrong on our end. Please try again later",
    }),
  );
};

export default errorHandler;
