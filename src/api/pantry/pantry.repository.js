import prisma from '#config/prisma.js';

/**
 * Añade un ingrediente al inventario (pantry) del usuario.
 * Si el ingrediente no existe en la base de datos global, lo crea automáticamente.
 * Si el usuario ya tiene ese ingrediente, suma la cantidad (si las unidades coinciden) o actualiza.
 * * @param {number} userId - ID del usuario.
 * @param {object} data - Datos del ingrediente (name, quantity, unit_of_measure).
 * @returns {Promise<object>} El item del inventario actualizado o creado.
 */
export const addToPantry = async (userId, data) => {
  const { name, quantity, unit_of_measure } = data;

  // Usamos una transacción para asegurar la integridad de los datos
  return prisma.$transaction(async (tx) => {
    
    // --- PASO 1: Obtener o Crear el Ingrediente Global ---
    // Usamos `upsert` para garantizar que obtenemos un ID válido.
    // Si ya existe "Arroz", nos da su ID. Si no, crea "Arroz" y nos da el nuevo ID.
    const ingredient = await tx.ingredient.upsert({
      where: { name: name.toLowerCase() }, // Normalizamos a minúsculas para evitar duplicados
      update: {}, // Si existe, no cambiamos nada
      create: { name: name.toLowerCase() }, // Si no existe, lo creamos
    });

    // --- PASO 2: Verificar si ya está en el Pantry del Usuario ---
    // Buscamos usando la clave compuesta única (userId + ingredientId)
    const existingPantryItem = await tx.userPantryItem.findUnique({
      where: {
        user_id_ingredientId: {
          user_id: userId,
          ingredientId: ingredient.id,
        },
      },
    });

    // --- PASO 3: Decidir si Crear o Actualizar ---
    if (existingPantryItem) {
      // LOGICA DE NEGOCIO: ¿Sumar o Sobrescribir?
      let newQuantity = quantity;

      // Si la unidad de medida es la misma (ej: tenía "kg" y añade "kg"), SUMAMOS.
      if (existingPantryItem.unit_of_measure.toLowerCase() === unit_of_measure.toLowerCase()) {
        // Nota: Prisma devuelve Decimal como objeto o string, lo convertimos para operar
        newQuantity = Number(existingPantryItem.quantity) + quantity;
      }
      // Si la unidad es diferente (ej: tenía "litros" y añade "tazas"),
      // por ahora SOBRESCRIBIMOS la cantidad y la unidad con lo nuevo.
      // (En una v2 podrías implementar un conversor de unidades aquí).

      return tx.userPantryItem.update({
        where: { id: existingPantryItem.id },
        data: {
          quantity: newQuantity,
          unit_of_measure: unit_of_measure, // Actualizamos la unidad por si cambió
        },
        include: { ingredient: true } // Devolvemos el item con el nombre del ingrediente
      });

    } else {
      // Si no existe en su despensa, creamos una nueva entrada
      return tx.userPantryItem.create({
        data: {
          user_id: userId,
          ingredientId: ingredient.id,
          quantity: quantity,
          unit_of_measure: unit_of_measure,
        },
        include: { ingredient: true }
      });
    }
  });
};