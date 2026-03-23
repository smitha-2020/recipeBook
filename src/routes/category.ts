import express from "express";

const router = express.Router();
import {
  deleteCategory,
  getCategories,
  getCategoriesById,
  postCategories,
  updateCategory,
} from "../controller/categoryController.js";
import { CategoryCreateJoi, CategoryPatchJoi } from "../model/category.js";
import validation from "../middleware/schemaValidation.js";
import { validateObjectId } from "../middleware/validateObjectId.js";

router.get("/", getCategories);
router.get("/:id", validateObjectId(), getCategoriesById);
router.post("/", validation(CategoryCreateJoi), postCategories);
router.put(
  "/:id",
  validateObjectId(),
  validation(CategoryPatchJoi),
  updateCategory,
);
router.delete("/:id", validateObjectId(), deleteCategory);

export default router;
