import mongoose, { Document } from "mongoose";
import Joi from "joi";
import { reviewSchema } from "./review.js";
import {
  CategoryCreateJoi,
  categorySchema,
} from "./category.js";
import { ICategorySchema } from "./categorySnapshot.js";
const { Schema } = mongoose;

export enum IAffordability {
  affordable = "affordable",
  pricey = "pricey",
  luxurious = "luxurious",
}

export enum IComplexity {
  simple = "simple",
  challenging = "challenging",
  hard = "hard",
}

export interface IRecipeSchema extends Document {
  category: mongoose.Schema.Types.ObjectId[];
  categorySnapshot: ICategorySchema[];
  title: string;
  slug: string;
  affordability: IAffordability;
  complexity: IComplexity;
  imageUrl: string;
  duration: number;
  ingredients: string[];
  steps: string[];
  isGlutenFree: boolean;
  isVegan: boolean;
  isVegetarian: boolean;
  isLactoseFree: boolean;
  isFav: boolean;
  reviewedBy: string;
  postedBy: mongoose.Schema.Types.ObjectId;
}

export const recipeSchema = new Schema<IRecipeSchema>(
  {
    category: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Category",
      required: true,
      validate: {
        validator: (ids: mongoose.Schema.Types.ObjectId[]) => ids.length > 0,
        message: "At least one category must be provided",
      },
    },
    categorySnapshot: {
      type: [categorySchema],
      required: true,
    },
    title: {
      type: String,
      required: true,
      minLength: 5,
      maxLength: 50,
    },
    slug: {
      type: String,
      unique: true,
    },
    affordability: {
      type: String,
      enum: Object.values(IAffordability),
      required: true,
    },
    complexity: {
      type: String,
      required: true,
      enum: Object.values(IComplexity),
    },
    imageUrl: {
      type: String,
      required: true,
      match: /^https?:\/\/.+/,
    },
    duration: {
      type: Number,
      required: true,
      min: 1,
      max: 300,
    },
    ingredients: {
      type: [String],
      required: true,
      validate: {
        validator: (ingredientsList: string[]) => ingredientsList.length > 0,
        message: "Ingredients list cannot be empty",
      },
    },
    steps: {
      type: [String],
      required: true,
      validate: {
        validator: (steps: string[]) => steps.length > 0,
        message: "steps cannot be empty",
      },
    },
    isGlutenFree: { type: Boolean, default: false },
    isVegan: { type: Boolean, default: false },
    isVegetarian: { type: Boolean, default: false },
    isLactoseFree: { type: Boolean, default: false },
    isFav: { type: Boolean, default: false },

    reviewedBy: [reviewSchema],

    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: "User",
    },
  },
  { timestamps: true },
);

recipeSchema.post("save", function (doc) {
  console.error("this fired after a document was saved", doc._id);
});

export const Recipe = mongoose.model<IRecipeSchema>("Recipe", recipeSchema);

export const RecipeJoiSchema = Joi.object({
  category: Joi.array().items(Joi.string()).required().min(1),
  categorySnapshot: Joi.array().items(CategoryCreateJoi).required().min(1),
  title: Joi.string().min(5).max(50),
  slug: Joi.string().min(15).max(25),
  affordability: Joi.string().valid(Object.values(IAffordability).join(",")),
  complexity: Joi.string().valid(Object.values(IComplexity).join(",")),
  imageUrl: Joi.string().uri().required(),
  duration: Joi.number().integer().min(5).positive().required(),
  ingredients: Joi.array().items(Joi.string()).required(),
  steps: Joi.array().items(Joi.string()).required(),
  isGlutenFree: Joi.boolean().required().default(false),
  isVegan: Joi.boolean().required().default(false),
  isVegetarian: Joi.boolean().required().default(false),
  isLactoseFree: Joi.boolean().required().default(false),
  isFav: Joi.boolean().required().default(false),
  reviewedBy: Joi.string().optional(),
  postedBy: Joi.string().optional(),
});
