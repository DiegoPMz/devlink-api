import { AppError } from "@/utils/customErrors";
import { Request, Response } from "express";

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _: unknown,
) => {
  if (err instanceof AppError) {
    return res
      .status(err.status)
      .json({ message: err.message, status: err.status });
  }

  return res.status(404).json({ message: err.message, status: 404 });
};

export default errorHandler;
