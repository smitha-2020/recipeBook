import express from "express";
import {
  createRecipe,
  deleteRecipe,
  getRecipes
} from "../controller/recipeController.js";
import { validateObjectId } from "../middleware/validateObjectId.js";

const router = express.Router();

router.get("/", getRecipes);
router.post("/", createRecipe);
router.delete("/:id", validateObjectId(), deleteRecipe);

export default router;
