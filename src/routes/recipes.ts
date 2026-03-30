import express from "express";
import {
  createRecipe,
  deleteRecipe,
  getRecipeById,
  getRecipes,
  updateRecipe
} from "../controller/recipeController.js";
import { validateObjectId } from "../middleware/validateObjectId.js";

const router = express.Router();

router.get("/", getRecipes);
router.get("/:id",validateObjectId(), getRecipeById)
router.put("/:id",validateObjectId(), updateRecipe)
router.post("/", createRecipe);
router.delete("/:id", validateObjectId(), deleteRecipe);

export default router;
