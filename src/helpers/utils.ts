import { StatusCodes } from "http-status-codes";
import mongoose, { isValidObjectId } from "mongoose";
import { Response } from "express";

export const convertToValidObjectId = (id: string | string[] | undefined,res:Response) => {
  const objectId = Array.isArray(id) ? id[0] : id;

  if (!objectId || !isValidObjectId(objectId))
    return res.status(StatusCodes.NOT_FOUND).send("id is not of type ObjectId");
  return new mongoose.Types.ObjectId(objectId);
}