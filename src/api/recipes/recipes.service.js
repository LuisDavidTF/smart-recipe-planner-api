import * as recipesRepository from "#recipes/recipes.repository.js";
/**
 * Orquesta la creación de una nueva receta.
 * @param {number} userId - El ID del usuario.
 * @param {object} recipeData - Los datos validados de la receta.
 * @returns {Promise<object>} La receta creada.
 */
export const createRecipeService = async (userId, recipeData) => {
  // 1. La única responsabilidad de datos que tiene es llamar al repositorio.
  // El repositorio maneja todos los datos y relaciones complejas.
  const newRecipe = await recipesRepository.create(userId, recipeData);

  return newRecipe;
};
