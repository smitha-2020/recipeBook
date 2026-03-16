import express from "express";
import { getRecipes } from "../controller/recipeController.js";

const router = express.Router();

router.get("/", getRecipes);

export default router;
