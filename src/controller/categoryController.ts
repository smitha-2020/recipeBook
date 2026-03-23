import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Category } from "../model/category.js";
import { ErrorWithStatusCode } from "../middleware/error.js";
import { deleteCategoryAndSyncRecipe } from "../helpers/category.js";
import mongoose, { isValidObjectId } from "mongoose";

export const getCategories = async (req: Request, res: Response) => {
  const categories = await Category.find();

  if (!categories || categories.length === 0)
    return res.status(StatusCodes.NOT_FOUND).send([]);
  return res.status(StatusCodes.OK).send(categories);
};

export const getCategoriesById = async (req: Request, res: Response) => {
  const categories = await Category.findById({ _id: req.params.id });
  if (!categories)
    return res.status(StatusCodes.NOT_FOUND).send("Category with ID not found");

  return res.status(StatusCodes.OK).send(categories);
};

export const postCategories = async (req: Request, res: Response) => {
  const existing = await Category.findOne({ slug: req.body.slug });
  if (existing) {
    return res.status(StatusCodes.NOT_MODIFIED).send("Slug already exists");
  }
  const createCategory = {
    slug: req.body.slug,
    title: req.body.title,
    color: req.body.color,
  };

  await Category.create(createCategory);
  return res.status(StatusCodes.OK).send(await Category.find());
};

export const updateCategory = async (req: Request, res: Response) => {
  const categoryToUpdate = {
    slug: req.body.slug,
    title: req.body.title,
    color: req.body.color,
  };
  const updatedCategory = await Category.findByIdAndUpdate(
    req.params.id,
    categoryToUpdate,
  );

  if (!updatedCategory)
    throw new ErrorWithStatusCode(
      "Category with ID not found",
      StatusCodes.NOT_FOUND,
    );

  return res.status(StatusCodes.OK).send(updatedCategory);
};

export const deleteCategory = async (req: Request, res: Response) => {
  const raw = req.params.id;

  const id = Array.isArray(raw) ? raw[0] : raw;
  if (!id || !isValidObjectId(id))
    return res.status(StatusCodes.NOT_FOUND).send("not a valid category");

  const categoryId = new mongoose.Types.ObjectId(id);

  deleteCategoryAndSyncRecipe(categoryId, res);
};
