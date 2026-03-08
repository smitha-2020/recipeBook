import { NextFunction, Request, Response } from "express";

export class ErrorWithStatusCode extends Error {
  StatusCode?: string | number;
  constructor(message: string, statusCode: number | string) {
    super(message);
    this.StatusCode = statusCode;
  }
}

const errorMiddleWare = (
  err: ErrorWithStatusCode,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const errorCode = err.StatusCode || 500;
  return res
    .status(errorCode as number)
    .json({
      message: err.message,
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
};

export default errorMiddleWare;
