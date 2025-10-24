import { Router } from "express";
import { createRecipeController, findPublicRecipesController} from "#recipes/recipes.controller.js";
import { isAuthenticated } from "#middlewares/isAutenticated.js";
import { validateSchema } from "#middlewares/validateSchema.js";
import { createRecipeSchema, findPublicRecipesSchema} from "#schemas/recipe.schema.js";

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
export default router;