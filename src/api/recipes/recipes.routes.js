import { Router } from "express";
import { createRecipeController } from "#recipes/recipes.controller.js";
import { isAuthenticated } from "#middlewares/isAutenticated";
import { validateSchema } from "#middlewares/validateSchema.js";
import { createRecipeSchema } from "#schemas/recipes.schema.js";

const router = Router();
// POST /api/v1/recipes - Ruta para crear una nueva receta
router.post(
  "/create",
  isAuthenticated,
  validateSchema(createRecipeSchema),
  createRecipeController
);

export default router;