import { Router } from "express";
import { createRecipeController, findPublicRecipesController, findRecipeByIdController, updateRecipeByIdController, deleteRecipeByIdController } from "#recipes/recipes.controller.js";
import { isAuthenticated, authenticateOptional } from "#middlewares/authentication.js";
import { validateSchema } from "#middlewares/validateSchema.js";
import { createRecipeSchema, findPublicRecipesSchema, recipeIdParamSchema, updateRecipeByIdSchema} from "#schemas/recipe.schema.js";

const router = Router();
// POST /api/v1/recipes - Ruta para crear una nueva receta
router.post(
  "/create",
  isAuthenticated,
  validateSchema(createRecipeSchema),
  createRecipeController
);

// GET /api/v1/recipes - Ruta para buscar recetas públicas con paginación por cursor
router.get(
  "/",
  validateSchema(findPublicRecipesSchema, 'query'),
  findPublicRecipesController
);

// Get /api/v1/recipes/:recipeId - Ruta para obtener una receta por su ID
router.get(
  "/:recipeId",
  authenticateOptional,
  validateSchema(recipeIdParamSchema, 'params'),
  findRecipeByIdController
);

// Patch /api/v1/recipes/:recipeId - Ruta para actualizar una receta por su ID
router.patch(
  "/:recipeId",
  isAuthenticated,
  validateSchema(recipeIdParamSchema, 'params'),
  validateSchema(updateRecipeByIdSchema),
  updateRecipeByIdController
);

// DELETE /api/v1/recipes/:recipeId - Ruta para eliminar una receta por su ID
router.delete(
  "/:recipeId",
  isAuthenticated,
  validateSchema(recipeIdParamSchema, 'params'),
  deleteRecipeByIdController
);


export default router;
