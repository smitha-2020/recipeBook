import { Response } from "express";
import { Category } from "../model/category.js";
import mongoose from "mongoose";

import { StatusCodes } from "http-status-codes";
import { Recipe } from "../model/recipe.js";

export const deleteCategoryAndSyncRecipe = async (
  id: mongoose.Types.ObjectId,
  res: Response,
) => {
  const category = await Category.findById(id);
  if (!category)
    return res.status(StatusCodes.NOT_FOUND).send("Category with ID not found");

  //check all the affected recipes
  const affected = await Recipe.find({
    category: category._id,
  } as any);

  const deletedCategory = await Category.deleteOne({ _id: category._id });
  if (!deletedCategory)
    return res
      .status(StatusCodes.NOT_FOUND)
      .send("Category with ID could not be deleted");

  //update the recipe category[] to reflect deleted category
  await Recipe.updateMany(
    { _id: { $in: affected.map((r) => r._id) } },
    { $pull: { category: category._id } },
  );

  //update the recipes to update the 
  for (const recipe of affected) {
    const currentRecipe = await Recipe.findById(recipe._id).select(
      "_id category",
    );

    if (!currentRecipe) continue;
    if (!currentRecipe.category.length) {
      await Recipe.deleteOne({ _id: currentRecipe._id });
      continue;
    }
    const categories = await Category.find({
      _id: { $in: currentRecipe.category },
    })
      .select("slug title color")
      .lean();

    const snapshot = categories.map((c) => ({
      slug: c.slug,
      title: c.title,
      color: c.color,
    }));
    await Recipe.updateOne(
      { _id: currentRecipe._id },
      { $set: { categorySnapshot: snapshot } },
    );
  }

  const recipesWithUpdatedSnapshot = await Recipe.find();

  return res.status(StatusCodes.OK).send(recipesWithUpdatedSnapshot);
};
