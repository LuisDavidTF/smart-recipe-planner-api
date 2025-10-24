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

/**
 * Busca recetas públicas usando paginación por cursor, ideal para infinite scroll.
 * @param {number} limit - El número de recetas a devolver.
 * @param {number} [cursor] - El ID de la última receta vista (opcional, para páginas siguientes).
 * @returns {Promise<{data: Array<object>, nextCursor: number|null}>} Un objeto con la lista de recetas y el cursor para la siguiente página.
 */
// El servicio ahora recibe el objeto completo de datos validados.
export const findPublicRecipesService = async (validatedQuery) => {
  const { limit, cursorId, cursorDate } = validatedQuery;

  let cursor = undefined;
  if (cursorId && cursorDate) {
    cursor = { id: cursorId, createdAt: new Date(cursorDate) };
  }

  const recipesPage = await recipesRepository.findPublicRecipes(limit, cursor);

  return recipesPage;
};

