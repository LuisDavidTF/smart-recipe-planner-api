import prisma from "#config/prisma.js";
/**
 * @typedef {import('@prisma/client').Prisma.RecipeCreateInput} RecipeCreateInput
 */

/**
 * Crea una nueva receta con todas sus relaciones (ingredientes, multimedia) en una ÚNICA operación atómica.
 * Este enfoque "declarativo" usa las escrituras anidadas de Prisma para máxima eficiencia y legibilidad,
 * alineándose con el patrón usado en la función `updateById`.
 * @param {number} userId - El ID del usuario que está creando la receta.
 * @param {RecipeCreateInput & { ingredients: any[], media: any[] }} recipeData - Los datos validados para la nueva receta.
 * @returns {Promise<object>} La receta recién creada, completamente poblada con sus ingredientes y multimedia relacionados.
 */
export const create = async (userId, recipeData) => {
  // Desestructuramos los datos que vienen del servicio.
  const { ingredients, media, ...mainRecipeData } = recipeData;

  // `prisma.recipe.create` se convierte en una única operación atómica.
  // Prisma se encarga de la transacción implícitamente cuando usamos escrituras anidadas.
  return prisma.recipe.create({
    // --- PASO 1: Datos de la Receta Principal ---
    data: {
      ...mainRecipeData,
      user_id: userId, // Asociamos la receta con el usuario

      // --- PASO 2: Escritura Anidada para Ingredientes ---
      // Le decimos a Prisma que, al mismo tiempo que crea la receta,
      // también cree los registros relacionados en `RecipeIngredient`.
      ingredients: {
        create: ingredients.map(ingredient => ({
          quantity: ingredient.quantity,
          unit_of_measure: ingredient.unit_of_measure,
          // Anidamos un 'connectOrCreate' para el ingrediente en sí.
          // Esto es idéntico a tu lógica de `update`:
          // 1. Busca un ingrediente con este nombre (where).
          // 2. Si no existe, lo crea (create).
          // 3. Luego, conecta el ingrediente (nuevo o existente) a este registro de RecipeIngredient.
          ingredient: {
            connectOrCreate: {
              where: { name: ingredient.name.toLowerCase() },
              create: { name: ingredient.name.toLowerCase() },
            },
          },
        })),
      },

      // --- PASO 3: Escritura Anidada para Multimedia ---
      // Solo ejecutamos este bloque si el arreglo `media` existe y no está vacío.
      // Usamos el "spread condicional" para no enviar una clave 'media' vacía.
      ...(media && media.length > 0 && {
        media: {
          // 'create' es el equivalente a 'set' pero para una operación de creación.
          // Creará todos los registros de media y los asociará automáticamente con esta receta.
          create: media.map(item => ({
            url: item.url,
            media_type: item.media_type,
            display_order: item.display_order,
          })),
        },
      }),
    },

    // --- PASO 4: Incluir Datos Relacionados ---
    // ¡Ya no necesitamos una segunda consulta! `create` puede devolver
    // las relaciones que le pidamos con `include`, haciendo la operación mucho más eficiente.
    include: {
      user: {
        select: {
          id: true,
          name: true,
        },
      },
      ingredients: {
        include: {
          ingredient: true,
        },
      },
      media: true,
    },
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
        include: {
          ingredient: true
        }
      },
      media: true,
    },
  });
  return updatedRecipe;
};

/** Elimina una receta por su ID, asegurando que solo el propietario pueda hacerlo.
 * @param {number} userId - El ID del usuario que está eliminando la receta.
 * @param {number} recipeId - El ID de la receta a eliminar.
 * @returns {Promise<object>} La receta eliminada.
  * @throws {Prisma.PrismaClientKnownRequestError} Si la receta no se encuentra o el usuario no tiene permiso.
 */
export const deleteById = async (userId, recipeId) => {
  // `prisma.recipe.delete` es una única operación atómica.
  // Combina la búsqueda, la autorización y la eliminación en un solo paso.

  return prisma.$transaction(async (tx) => {
    // Primero, eliminamos las relaciones en tablas intermedias para mantener la integridad referencial.
    await tx.recipeIngredient.deleteMany({
      where: { recipe_id: recipeId },
    });
    await tx.recipeMedia.deleteMany({
      where: { recipe_id: recipeId },
    });

    // Ahora, eliminamos la receta principal.
    // Si no encuentra una receta con este ID Y que le pertenezca a este usuario, devuelve un error.
    const deletedRecipe = await tx.recipe.delete({
      where: {
        id: recipeId,
        user_id: userId,
      },
    });
    return deletedRecipe;
  });
};
