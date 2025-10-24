import { createRecipeService, findPublicRecipesService} from "#recipes/recipes.service.js";

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
        const { limit, cursorId, cursorDate } = req.validatedData;

        // Construimos el cursor solo si los parámetros existen
        let cursor = undefined;
        if (cursorId && cursorDate) {
            cursor = { id: cursorId, createdAt: cursorDate };
        }

        const { data, nextCursor } = await findPublicRecipesService(limit, cursor);

        res.status(200).json({
            data: data,
            nextCursor: nextCursor
        });
    } catch (error) {
        next(error);
    }
};