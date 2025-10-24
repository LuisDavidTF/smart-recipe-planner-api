import { Router } from "express";
import { createRecipeController, findPublicRecipesController, findRecipeByIdController } from "#recipes/recipes.controller.js";
import { isAuthenticated, authenticateOptional } from "#middlewares/authentication.js";
import { validateSchema } from "#middlewares/validateSchema.js";
import { createRecipeSchema, findPublicRecipesSchema, findRecipeByIdSchema } from "#schemas/recipe.schema.js";

const router = Router();
// POST /api/v1/recipes - Ruta para crear una nueva receta
router.post(
  "/create",
  isAuthenticated,
  validateSchema(createRecipeSchema),
  createRecipeController
);

// GET /api/v1/recipes/public - Ruta para buscar recetas públicas con paginación por cursor
router.get(
  "/public",
  validateSchema(findPublicRecipesSchema, 'query'),
  findPublicRecipesController
);

// Get /api/v1/recipes/:recipeId - Ruta para obtener una receta por su ID
router.get(
  "/:recipeId",
  authenticateOptional,
  validateSchema(findRecipeByIdSchema, 'params'),
  findRecipeByIdController
);

export default router;