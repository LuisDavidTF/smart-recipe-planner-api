import prisma from "#config/prisma.js";
/**
 * @typedef {import('@prisma/client').Prisma.RecipeCreateInput} RecipeCreateInput
 * @typedef {import('@prisma/client').Prisma.RecipeUpdateInput} RecipeUpdateInput
 */

/**
 * Crea una nueva receta con todas sus relaciones (ingredientes, multimedia) dentro de una única transacción de base de datos.
 * Este enfoque de "todo o nada" garantiza la integridad de los datos; si algún paso falla, toda la operación se revierte (rollback).
 * @param {number} userId - El ID del usuario que está creando la receta.
 * @param {RecipeCreateInput & { ingredients: any[], media: any[] }} recipeData - Los datos validados para la nueva receta, estructurados según el schema de Zod.
 * @returns {Promise<object>} La receta recién creada, completamente poblada con sus ingredientes y multimedia relacionados.
 */
export const create = async (userId, recipeData) => {
  // Desestructuramos los datos que vienen del servicio.
  // Separamos los campos principales de la receta (`mainRecipeData`) de los arreglos
  // que representan relaciones con otras tablas (`ingredients`, `media`).
  const { ingredients, media, ...mainRecipeData } = recipeData;

  // Iniciamos una transacción de Prisma. Todas las operaciones de base de datos dentro de este bloque
  // se ejecutarán como una única unidad. O todas tienen éxito, o todas fallan.
  // El objeto `tx` es un cliente de Prisma especial, con ámbito a esta transacción.
  const newRecipe = await prisma.$transaction(async (tx) => {

    // --- PASO 1: Crear el registro principal de la Receta ---
    // Este es el corazón de la operación. Creamos la receta y la asociamos con el
    // usuario que la está creando (`user_id`). Guardamos el resultado en `createdRecipe`
    // porque necesitaremos su `id` para los siguientes pasos.
    const createdRecipe = await tx.recipe.create({
      data: {
        ...mainRecipeData,
        user_id: userId,
      },
    });

    // --- PASO 2: Manejar los Ingredientes ---
    // Iteramos sobre el arreglo de ingredientes que nos llegó.
    for (const ingredient of ingredients) {
      // Usamos `upsert` para una gestión de ingredientes eficiente y sin duplicados.
      // `upsert` significa "update or insert" (actualizar o insertar).
      // 1. `where`: Intenta encontrar un ingrediente con el mismo nombre (lo convertimos a minúsculas para evitar duplicados como "Harina" y "harina").
      // 2. `create`: Si NO lo encuentra, crea un nuevo registro de ingrediente.
      // 3. `update`: Si SÍ lo encuentra, no hacemos nada (objeto vacío), pero podríamos usar esto para actualizar datos si fuera necesario.
      const existingOrNewIngredient = await tx.ingredient.upsert({
        where: { name: ingredient.name.toLowerCase() },
        update: {},
        create: { name: ingredient.name.toLowerCase() },
      });

      // Ahora, creamos el registro en la tabla intermedia `RecipeIngredient`.
      // Esta es la "unión" que conecta la receta (`createdRecipe.id`) con el ingrediente
      // (`existingOrNewIngredient.id`) y almacena la información específica de esta relación,
      // como la cantidad y la unidad de medida.
      await tx.recipeIngredient.create({
        data: {
          recipe_id: createdRecipe.id,
          ingredient_id: existingOrNewIngredient.id,
          quantity: ingredient.quantity,
          unit_of_measure: ingredient.unit_of_measure,
        },
      });
    }

    // --- PASO 3: Manejar los Archivos Multimedia Adicionales (si existen) ---
    // Solo ejecutamos este bloque si el arreglo `media` no está vacío.
    if (media && media.length > 0) {
      // Usamos `createMany` para insertar todos los registros de multimedia en una sola consulta a la base de datos,
      // lo cual es mucho más rápido y eficiente que crearlos uno por uno en un bucle.
      // Mapeamos el arreglo `media` para añadir el `recipe_id` a cada objeto antes de insertarlo.
      await tx.recipeMedia.createMany({
        data: media.map(item => ({
          ...item,
          recipe_id: createdRecipe.id,
        })),
      });
    }

    // --- PASO 4: Finalizar la Transacción ---
    // Al devolver `createdRecipe`, Prisma entiende que la transacción fue un éxito y la confirma (commit).
    // Si cualquiera de las promesas (`await`) anteriores hubiera fallado, se habría lanzado un error,
    // y Prisma automáticamente habría revertido (rollback) todos los cambios hechos hasta ese punto.
    return createdRecipe;
  });

  // La transacción fue un éxito. La variable `newRecipe` contiene los datos básicos de la receta que se creó.
  // Sin embargo, para devolver una respuesta completa a la API, queremos que el objeto incluya
  // también la lista de ingredientes y multimedia que acabamos de crear.
  // Por lo tanto, hacemos una consulta final para buscar la receta por su ID y usamos `include`
  // para cargar ("hidratar") esas relaciones.

  return prisma.recipe.findUnique({
    where: { id: newRecipe.id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
        },
      },
      ingredients: {
        include: {
          ingredient: true, // Incluimos los detalles del ingrediente (ej. su nombre)
        },
      },
      media: true, // Incluimos todos los campos de los archivos multimedia
    },
  });
};



/**
 * Busca recetas públicas usando paginación por cursor, ideal para infinite scroll.
 * @param {number} limit - El número de recetas a devolver.
 * @param {{createdAt: string, id: number}} [cursor] - El cursor de la última receta vista (opcional, para páginas siguientes).
 * @returns {Promise<{data: Array<object>, nextCursor: number|null}>} Un objeto con la lista de recetas y el cursor para la siguiente página.
 */
export const findPublicRecipes = async (limit, cursor) => {

  // La ventaja de usar paginación basada en cursor es que es más eficiente y escalable para conjuntos de datos grandes,
  // ya que evita los problemas de rendimiento asociados con la paginación basada en offset.

  const take = limit + 1; // Tomamos un registro extra para determinar si hay más datos disponibles

  // Construimos las opciones de consulta dinámicamente
  const queryOptions = {
    where: { visibility: "public" },
    select: {
      id: true,
      name: true,
      description: true,
      image_url: true,
      createdAt: true
    },
    orderBy: [{ createdAt: "desc" }, { id: "desc" }], // Ordenamos por fecha de creación descendente y luego por ID para consistencia
    take: take,
  };
  // al tener un orden compuesto, necesitamos el cursor compuesto
  if (cursor) {
    // Agregamos la condición para el cursor compuesto
    queryOptions.where = {
      ...queryOptions.where,
      OR: [
        {
          // Primero comparamos por createdAt
          createdAt: { lt: new Date(cursor.createdAt) }
        },
        {
          // Si createdAt es igual, comparamos por ID
          createdAt: new Date(cursor.createdAt),
          id: { lt: cursor.id }
        }
      ]
    }
  }
  // Realizamos la consulta
  const recipes = await prisma.recipe.findMany(queryOptions);

  // Determinamos el nextCursor
  let nextCursor = null;
  // Si obtuvimos el número máximo de registros, significa que hay más datos disponibles
  if (recipes.length === take) {
    const lastRecipe = recipes.pop(); // Removemos el registro extra
    // Creamos el nextCursor compuesto
    nextCursor = {
      createdAt: lastRecipe.createdAt.toISOString(),
      id: lastRecipe.id,
    };
  }
  // Devolvemos los datos y el nextCursor
  return {
    data: recipes,
    nextCursor: nextCursor,
  }
};


/** 
 * Obtiene una receta por su ID, incluyendo ingredientes y multimedia relacionados. *
 * También valida que la receta sea pública o que pertenezca al usuario autenticado. *
 * @param {number} recipeId - El ID de la receta a buscar. * 
 * @param {number} [userId] - El ID del usuario autenticado (opcional). *
 * @returns {Promise<object|null>} La receta encontrada con sus relaciones, o null si no existe. 
 * */

export const findById = async (recipeId, userId) => {
  const whereConditions = {
    id: recipeId,
    OR: [{ visibility: "public" }],
  };

  if (userId) {
    whereConditions.OR.push({ user_id: userId });
  }

  return prisma.recipe.findFirst({
    where: whereConditions,
    include: {
      user: {
        select: {
          id: true,
          name: true,
        },
      },
      ingredients: {
        include: {
          ingredient: true, // Incluimos los detalles del ingrediente (ej. su nombre)
        },
      },
      media: true, // Incluimos todos los campos de los archivos multimedia
    },
  });
}

/**
 * Actualiza una receta existente por su ID usando escrituras anidadas de Prisma para máxima eficiencia.
 * La cláusula 'where' garantiza que solo el propietario de la receta pueda actualizarla.
 * @param {number} userId - El ID del usuario que está actualizando la receta.
 * @param {number} recipeId - El ID de la receta a actualizar.
 * @param {RecipeUpdateInput & { ingredients?: any[], media?: any[] }} updateData - Los datos validados para actualizar la receta.
 * @returns {Promise<object>} La receta actualizada con todas sus relaciones.
 * @throws {Prisma.PrismaClientKnownRequestError} Si la receta no se encuentra o el usuario no tiene permiso.
 */
export const updateById = async (userId, recipeId, updateData) => {
  const { ingredients, media, ...mainRecipeData } = updateData;

  // `prisma.recipe.update` es una única operación atómica.
  // Combina la búsqueda, la autorización y la actualización en un solo paso.
  const updatedRecipe = await prisma.recipe.update({
    //Si no encuentra una receta con este ID Y que le pertenezca a este usuario, 
    // lanzará un error.
    where: {
      id: recipeId,
      user_id: userId,
    },
    // En 'data' especificamos qué campos de la receta principal se actualizan
    // y cómo deben cambiar sus relaciones.
    data: {
      ...mainRecipeData, // Actualiza campos como name, description, etc.

      // --- Manejo de Ingredientes ---
      // Solo si el arreglo 'ingredients' fue incluido en la peticion...
      ...(ingredients && {
        ingredients: {
          // 1. Borramos todos los ingredientes existentes asociados a esta receta.
          deleteMany: {},
          // 2. Creamos los nuevos registros en la tabla intermedia.
          create: ingredients.map(ingredient => ({
            quantity: ingredient.quantity,
            unit_of_measure: ingredient.unit_of_measure,
            // Anidamos un 'upsert' para el ingrediente en sí.
            ingredient: {
              connectOrCreate: {
                where: { name: ingredient.name.toLowerCase() },
                create: { name: ingredient.name.toLowerCase() },
              },
            },
          })),
        },
      }),

      // --- Manejo de Multimedia ---
      // Solo si el arreglo 'media' fue incluido en la peticion...
      ...(media && {
        media: {
          // Usamos 'set' como un atajo para "borrar todo lo anterior y establecer esta nueva lista".
          set: media.map(item => ({
            url: item.url,
            media_type: item.media_type,
            display_order: item.display_order,
          })),
        },
      }),
    },
    // Incluimos las relaciones actualizadas en la respuesta final.
    include: {
      user: {
        select: {
          id: true,
          name: true,
        },
      },
      ingredients: { 
        include: { ingredient: true 
        } 
      },
      media: true,
    },
  });
  return updatedRecipe;
};