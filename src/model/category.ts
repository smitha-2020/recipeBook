import Joi from "joi";
import mongoose from "mongoose";
const { Schema } = mongoose;

export interface ICategorySchema {
  slug: string;
  title: string;
  color: string;
}

export const categorySchema = new Schema<ICategorySchema>({
  slug: { type: String, required: true },
  title: { type: String, required: true },
  color: { type: String, required: true },
});

export const Category = mongoose.model<ICategorySchema>(
  "Category",
  categorySchema,
);

export const CategoryJoiSchema = Joi.object({
  slug: Joi.string().required().min(5).max(15),
  title: Joi.string().required().min(5).max(20),
  color: Joi.string().required().min(5).max(20),
});
