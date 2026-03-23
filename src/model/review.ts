import mongoose from "mongoose";
import { userSchema } from "./user.js";
import Joi from "joi";

const { Schema } = mongoose;

export interface IReviewSchema {
  comment: string;
  reviewwer: string;
}

export const reviewSchema = new Schema<IReviewSchema>({
  comment: { type: String, minLength: 5, maxLength: 50, },
  reviewwer: userSchema,
});

export const ReviewJoiSchema = Joi.object({
  comment: Joi.string().optional()
});
