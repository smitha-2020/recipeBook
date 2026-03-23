import Joi from "joi";
import mongoose from "mongoose";
import { ICategorySchema } from "./categorySnapshot.js";
const { Schema } = mongoose;

export const categorySchema = new Schema<ICategorySchema>({
  slug: {
    type: String,
    required: false,
    unique: true,
    minLength: 1,
    default: "cDefault",
  },
  title: {
    type: String,
    required: false,
    minLength: 5,
    maxLength: 25,
    default: "Default",
  },
  color: { type: String, required: false, minLength: 6, default: "#ffffff" },
});

categorySchema.post("findOneAndUpdate", async function (doc) {
  if (!doc) return;

  const Recipe = mongoose.model("Recipe");

  console.log("Triggered");

  await Recipe.updateMany(
    { category: doc._id },
    {
      $set: {
        "categorySnapshot.$[elem]": {
          slug: doc.slug,
          title: doc.title,
          color: doc.color,
        },
      },
    },
    {
      arrayFilters: [{ "elem.slug": doc.slug }],
    },
  );
});

export const Category = mongoose.model<ICategorySchema>(
  "Category",
  categorySchema,
);

const CategoryBase = {
  slug: Joi.string().min(2).max(30),
  title: Joi.string().min(2).max(50),
  color: Joi.string().pattern(/^#[0-9A-Fa-f]{6}$/),
};
export const CategoryCreateJoi = Joi.object({
  slug: CategoryBase.slug.required(),
  title: CategoryBase.title.required(),
  color: CategoryBase.color.required(),
});
export const CategoryPutJoi = Joi.object({
  slug: CategoryBase.slug.required(),
  title: CategoryBase.title.required(),
  color: CategoryBase.color.required(),
});
export const CategoryPatchJoi = Joi.object({
  slug: CategoryBase.slug,
  title: CategoryBase.title,
  color: CategoryBase.color,
})
  .min(1) // at least one field must be provided
  .messages({ "object.min": "Provide at least one field to update" });
