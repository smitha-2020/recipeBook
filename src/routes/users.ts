import express from "express";
import { UserJoiSchema } from "../model/user.js";
import {
  registerUser,
  getCurrentUser,
  loggingOut,
} from "../controller/userController.js";
import validation from "../middleware/schemaValidation.js";
import authenticatedUser from "../middleware/authenticatedUser.js";

const router = express.Router();

router.post(
  "/register",
  validation(UserJoiSchema),
  authenticatedUser(),
  registerUser,
);
router.get("/me", authenticatedUser(), getCurrentUser);
router.get("/logout", authenticatedUser(), loggingOut);

export default router;
