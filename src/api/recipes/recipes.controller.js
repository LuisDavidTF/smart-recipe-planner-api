import { createRecipeService } from "#recipes/recipes.service.js";

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