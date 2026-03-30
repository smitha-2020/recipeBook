import { Request, Response } from "express";
import { IRecipeSchema, Recipe } from "../model/recipe.js";
import { StatusCodes } from "http-status-codes";
import mongoose, { isValidObjectId } from "mongoose";
import { Category } from "../model/category.js";
import _ from "lodash";
import { ICategorySchema } from "../model/categorySnapshot.js";
import { convertToValidObjectId } from "../helpers/utils.js";

export const getRecipes = async (req: Request, res: Response) => {
  const queryCategoryId = req.query.categoryId;
  let recipes:IRecipeSchema[]=[];

  const categoryId = Array.isArray(queryCategoryId) ? queryCategoryId[0]: queryCategoryId;
  if(!!categoryId || isValidObjectId(categoryId)){
     recipes = await Recipe.find({category: categoryId} as any);
     return res.status(StatusCodes.OK).send(recipes);
  }
  recipes =  await Recipe.find();
   if (!recipes || recipes.length === 0)
    return res.status(StatusCodes.NOT_FOUND).send([]);

  return res.status(StatusCodes.OK).send(recipes);
};

export const deleteRecipe = async (req: Request, res: Response) => {
  const id = convertToValidObjectId(req.params.id, res);
  const deletedRecipe = await Recipe.deleteOne({ _id: id } as any);
  if (!deletedRecipe)
    return res.status(StatusCodes.NOT_FOUND).send("Not deleted");
  return res.status(StatusCodes.OK).send(deletedRecipe);
};

export const createRecipe = async (req: Request, res: Response) => {
  const categories = req.body.category;
  const docs = await Category.find({ _id: { $in: categories } }).lean();
  const byId = new Map(docs.map((d) => [String(d._id), d]));
  const categorySnapshotArr: Partial<ICategorySchema>[] = categories.map(
    (id: mongoose.Types.ObjectId) => {
      const doc = byId.get(String(id));
      if (!doc) throw new Error(`Category not found: ${id}`);
      return _.pick(doc, ["slug", "title", "color"]);
    },
  );
  const recipeCreated = await Recipe.create({
    category: req.body.category,
    categorySnapshot: categorySnapshotArr,
    title: req.body.title,
    slug: req.body.slug,
    affordability: req.body.affordability,
    complexity: req.body.complexity,
    imageUrl: req.body.imageUrl,
    duration: req.body.duration,
    ingredients: req.body.ingredients,
    steps: req.body.steps,
    isGlutenFree: req.body.isGlutenFree,
    isVegan: req.body.isVegan,
    isVegetarian: req.body.isVegetarian,
    isLactoseFree: req.body.isLactoseFree,
    isFav: req.body.isFav,
    reviewedBy: req.body.reviewedBy,
    postedBy: req.body.postedBy,
  });
  if (!recipeCreated)
    return res
      .status(StatusCodes.NOT_FOUND)
      .send("Recipe could not be created");
  return res.status(StatusCodes.OK).send(recipeCreated);
};

//sort based on timestamp
//sort based on isVegan
