import { createRecipeService, findPublicRecipesService, findRecipeByIdService, updateRecipeByIdService, deleteRecipeByIdService } from "#recipes/recipes.service.js";

// Controlador para crear una nueva receta
export const createRecipeController = async (req, res, next) => {
    try {
        const recipeData = req.validated.body;

        const userId = req.user.id; 

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
        const results = await findPublicRecipesService(req.validated.query);

        //tarda 3 segundos en responder para simular carga
        await new Promise(resolve => setTimeout(resolve, 3000));
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
        const { recipeId } = req.validated.params;
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

/** Controlador para actualizar una receta existente.
 * @param {object} req - El objeto de la solicitud.
 * @param {object} res - El objeto de la respuesta.
 * @param {function} next - La función para pasar al siguiente middleware.
 */
export const updateRecipeByIdController = async (req, res, next) => {
    try {
        // Obtenemos el ID de la receta desde los parámetros validados.
        const { recipeId } = req.validated.params;
        // Obtenemos los datos de actualización desde el cuerpo validados.
        const updateData = req.validated.body;
        // Obtenemos el ID del usuario autenticado.
        const userId = req.user.id;
        const updatedRecipe = await updateRecipeByIdService(userId, recipeId, updateData);
        res.status(200).json({
            message: 'Receta actualizada exitosamente',
            recipe: updatedRecipe
        });
    } catch (error) {
        next(error);
    }
};

/** Controlador para eliminar una receta existente.
 * @param {object} req - El objeto de la solicitud.
 * @param {object} res - El objeto de la respuesta.
 * @param {function} next - La función para pasar al siguiente middleware.
 */

export const deleteRecipeByIdController = async (req, res, next) => {
    try {
        // Obtenemos el ID de la receta desde los parámetros validados.
        const { recipeId } = req.validated.params;
        // Obtenemos el ID del usuario autenticado.
        const userId = req.user.id;
        // Llamamos al servicio para eliminar la receta.
        await deleteRecipeByIdService(userId, recipeId);
        res.status(200).json({
            message: 'Receta eliminada exitosamente'
        });
    } catch (error) {
        next(error);
    }
};