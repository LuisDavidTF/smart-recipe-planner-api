import { Router } from "express";
import { generateRecipeController } from "#ai/ai.controller.js";
import { isAuthenticated } from "#middlewares/authentication.js";
import { validateSchema } from "#middlewares/validateSchema.js";
import { generateRecipeSchema } from "#schemas/ai.schema.js";

const router = Router();

// POST /api/v1/ai/generate-magic - Ruta para generar una receta usando IA
router.post(
  "/generate-magic",
  isAuthenticated,
  validateSchema(generateRecipeSchema, 'body'),
  generateRecipeController
);

export default router;