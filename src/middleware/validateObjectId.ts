import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { isValidObjectId } from "mongoose";

export const validateObjectId = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!isValidObjectId(req.params.id)) {
      return res.status(StatusCodes.NOT_FOUND).send("Not a valid Object Id");
    }
    next();
  };
};
