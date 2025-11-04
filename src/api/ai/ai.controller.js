import { generateRecipeService } from "#ai/ai.service.js";

export const generateRecipeController = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { prompt } = req.validated.body;

        const recipe = await generateRecipeService(userId, prompt);

        res.status(200).json({
            message: 'Receta generada exitosamente',
            recipe: recipe
        });
    } catch (error) {
        next(error);
    }
};