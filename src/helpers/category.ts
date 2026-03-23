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
  //check all the affecred recipes

  const recipes = await Recipe.find({
    category: category._id,
  } as any);

  const deletedCategory = await Category.deleteOne({ _id: category._id });
  if (!deletedCategory)
    return res
      .status(StatusCodes.NOT_FOUND)
      .send("Category with ID could not be deleted");

  //sync the recipes to reflect the deltetion

  await Recipe.updateMany(
    { _id: { $in: recipes.map((r) => r._id) } },
    { $pull: { category: category._id } },
  );

  for (const recipe of recipes) {
    // Reload recipe after $pull
    const currentRecipe = await Recipe.findById(recipe._id).select(
      "_id category",
    );

    if (!currentRecipe) continue;
    // Optional policy: if no categories left, delete recipe
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

  return res.send("Deleted");
};
