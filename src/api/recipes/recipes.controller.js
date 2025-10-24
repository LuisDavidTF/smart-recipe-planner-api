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
        const limit = parseInt(req.query.limit, 10) || 10; // Número de recetas a devolver, por defecto 10
        const cursorParam = req.query.cursor ? JSON.parse(req.query.cursor) : null; // Cursor para la paginación
        const { data, nextCursor } = await findPublicRecipesService(limit, cursorParam);

        res.status(200).json({
            data: data,
            nextCursor: nextCursor
        });
    } catch (error) {
        next(error);
    }
};