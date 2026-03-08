import express from "express";
const router = express.Router();
import {
  getGenreById,
  getGenres,
  postGenre,
  putGenre,
  deleteGenre,
} from "../controller/genreController.js";
import authenticatedUser from "../middleware/authenticatedUser.js";
import isAdmin from "../middleware/isAdmin.js";
import validation from "../middleware/schemaValidation.js";
import { GenreJoiSchema } from "../model/genre.js";

router.get("/", getGenres);
router.get("/:id", authenticatedUser(), isAdmin(), getGenreById);
router.post(
  "/",
  authenticatedUser(),
  isAdmin(),
  validation(GenreJoiSchema),
  postGenre,
);
router.put(
  "/:id",
  authenticatedUser(),
  isAdmin(),
  validation(GenreJoiSchema),
  putGenre,
);
router.delete("/:id", authenticatedUser(), isAdmin(), deleteGenre);

export default router;
