import { Request, Response } from "express";
import "../model/category.js";
import "../model/user.js";
import { Recipe } from "../model/recipe.js";
import { StatusCodes } from "http-status-codes";

export const getRecipes = async (_req: Request, res: Response) => {
  const recipes = await Recipe.find().populate("category postedBy");
  if (!recipes || recipes.length === 0)
    return res.status(StatusCodes.NOT_FOUND).send([]);
  return res.status(StatusCodes.OK).send(recipes);
};
