import { Request, Response } from "express";
import { IRecipeSchema, Recipe } from "../model/recipe.js";
import { StatusCodes } from "http-status-codes";
import mongoose, { isValidObjectId } from "mongoose";
import { Category } from "../model/category.js";
import _ from "lodash";
import { ICategorySchema } from "../model/categorySnapshot.js";
import { convertToValidObjectId } from "../helpers/utils.js";

function parseBool(q: unknown){
  const val = q==="true"? true : q==="false" ? false: undefined;
  return val;
}

export const getRecipes = async (req: Request, res: Response) => {
  const queryCategoryId = req.query.categoryId;
  const order = req.query.sorting === "asc" ? {updatedAt:1} :  req.query.sorting === "desc"  ?  {updatedAt:-1}: {updatedAt:-1};

  const rec: Record<string,unknown> = {};
  const isGlutenFree = parseBool(req.query.isGlutenFree);
  const isVegan = parseBool(req.query.isVegan);
  const isVegetarian = parseBool(req.query.isVegetarian);
  const isLactoseFree = parseBool(req.query.isLactoseFree);
  const isFav = parseBool(req.query.isFav);
  if(isGlutenFree !== undefined)  rec.isGlutenFree=isGlutenFree;
  if(isVegan !== undefined)  rec.isVegan=isVegan;
  if(isVegetarian !== undefined)  rec.isVegetarian=isVegetarian;
  if(isLactoseFree !== undefined)  rec.isLactoseFree=isLactoseFree;
  if(isFav !== undefined)  rec.isFav=isFav;


  let recipes:IRecipeSchema[]=[];
  const categoryId = Array.isArray(queryCategoryId) ? queryCategoryId[0]: queryCategoryId;
  if(!!categoryId || isValidObjectId(categoryId)){
     rec.category=categoryId;
     recipes = await Recipe.find(rec as any).sort(order as any);
     return res.status(StatusCodes.OK).send(recipes);
  }
  recipes =  await Recipe.find(rec as any).sort(order as any);;
   if (!recipes || recipes.length === 0)
    return res.status(StatusCodes.NOT_FOUND).send([]);
  return res.status(StatusCodes.OK).send(recipes);
};

export const getRecipeById = async (req: Request, res: Response) => {
  const id = convertToValidObjectId(req.params.id, res);
  const recipe = await Recipe.find({_id:id} as any);
  if (!recipe || recipe.length === 0)
    return res.status(StatusCodes.NOT_FOUND).send("Recipe could not be found!");
  return res.status(StatusCodes.OK).send(recipe);
}

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

export const updateRecipe = async (req: Request, res: Response) => {
  const id = convertToValidObjectId(req.params.id, res);
  const payload: any = req.body;
  const categoryObjectIds: any[] = payload?.category?.map((ele: any) => { return convertToValidObjectId(ele,res)})
  const cats = await Category.find({ _id: { $in: categoryObjectIds} }).lean();
  const byId = new Map(
    cats.map((c) => [String(c._id), c])
  );
  if(payload.category){
    const categorySnapshot:[] = [];
    categoryObjectIds?.map((ele) =>{ 
      categorySnapshot.push(byId.get(ele.toString()) as never)});
    payload.categorySnapshot = categorySnapshot;
  }
  payload.updatedAt = Math.floor(Date.now() / 1000);
  const updatedRecipe = await Recipe.findByIdAndUpdate(id, { $set: payload })
  if(updatedRecipe) return res.status(StatusCodes.OK).send(updatedRecipe);
  return  res.status(StatusCodes.NOT_FOUND).send("Recipe with ID could not be updated");
};

export const sortRecipes = async(req: Request,res: Response) => {
  const order = req.params.sorting === "asc" ? {updatedAt:1} :  req.params.sorting === "desc"  ?  {updatedAt:-1}: {}
  const sortedRecipes = await Recipe.find().sort(order as any)
  if(!sortedRecipes)  return res.status(StatusCodes.NOT_FOUND).send("Cannot be sorted");
  return res.status(StatusCodes.OK).send(sortedRecipes);
}
