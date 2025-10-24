import { createRecipeService, findPublicRecipesService, findRecipeByIdService } from "#recipes/recipes.service.js";

// Controlador para crear una nueva receta
export const createRecipeController = async (req, res, next) => {
    try {
        const recipeData = req.body;

        const userId = req.user.id; // Suponiendo que el ID del usuario está disponible en req.user

        const newRecipe = await createRecipeService(userId, recipeData);

        res.status(201).json({
            message: 'Receta creada exitosamente',
            recipe: newRecipe
        });
    } catch (error) {
        next(error);
    }
};

// Controlador para buscar recetas públicas con paginación por cursor
export const findPublicRecipesController = async (req, res, next) => {
    try {
        // Simplemente pasamos los datos validados directamente al servicio.
        const results = await findPublicRecipesService(req.validatedData);

        res.status(200).json(results);
    } catch (error) {
        next(error);
    }
};

/** Controlador para obtener una receta por su ID, considerando la visibilidad y el usuario autenticado.
 * @param {object} req - El objeto de la solicitud.
 * @param {object} res - El objeto de la respuesta.
 * @param {function} next - La función para pasar al siguiente middleware.
 */
export const findRecipeByIdController = async (req, res, next) => {
    try {
        const { recipeId } = req.validatedData;
        const userId = req.user ? req.user.id : null;
        const recipe = await findRecipeByIdService(recipeId, userId);
        if (!recipe) {
            return res.status(404).json({ error: 'Receta no encontrada o sin acceso' });
        }
        res.status(200).json(recipe);
    } catch (error) {
        next(error);
    }
}