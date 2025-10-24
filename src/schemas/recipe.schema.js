import { z } from 'zod';

export const createRecipeSchema = z.object({
    name: z.string({ required_error: 'El nombre de la receta es obligatorio' }).nonempty('El nombre no puede estar vacío.').min(3, 'El nombre debe tener al menos 3 caracteres.'),
    description: z.string({ required_error: 'La descripción de la receta es obligatoria' }).nonempty('La descripción no puede estar vacía.').min(10, 'La descripción debe tener al menos 10 caracteres.'),
    image_url: z.string({ required_error: 'La URL de la imagen es obligatoria' }).url('La URL de la imagen no es válida.'),
    preparation_time_minutes: z.number({ required_error: 'El tiempo de preparación es obligatorio', invalid_type_error: 'El tiempo de preparación debe ser un número.' }).int().positive(),
    type: z.enum(['breakfast', 'lunch', 'dinner'], { required_error: 'El tipo de receta es obligatorio' }),
    visibility: z.enum(['public', 'private']).optional().default('private'),

    instructions: z.record(z.string(), z.string(), { required_error: 'Las instrucciones son requeridas.' }),

    ingredients: z.array(z.object({
        name: z.string({ required_error: 'El nombre del ingrediente es obligatorio.' }).nonempty('El nombre del ingrediente no puede estar vacío.'),
        quantity: z.coerce.number({ invalid_type_error: 'La cantidad debe ser un número.' }).positive({ message: 'La cantidad debe ser un número positivo.' }).optional(),
        unit_of_measure: z.string({ required_error: 'La unidad de medida es requerida.' }).nonempty('La unidad de medida no puede estar vacía.')
    })).min(1, { message: 'La receta debe tener al menos un ingrediente.' }),

    media: z.array(z.object({
        url: z.string().url({ message: 'La URL del medio no es válida.' }),
        media_type: z.enum(['image', 'video']),
        display_order: z.number().int()
    })).optional()
});

export const findPublicRecipesSchema = z.object({
    // Para `limit`:
    // 1. `z.coerce.number()`: Le dice a Zod que intente convertir el string a un número.
    // 2. `.int().positive()`: Asegura que sea un entero positivo.
    // 3. `.default(10)`: Si no se proporciona, asigna un valor por defecto de 10.
    limit: z.coerce.number({
        invalid_type_error: "El límite debe ser un número."
    }).int()
        .positive()
        .max(50, { message: "El límite no puede ser mayor a 50." })
        .default(10),

    // Para `cursor`:
    // Usamos `z.preprocess` para manejar la transformación del JSON de forma segura.
    // 1. El primer argumento es una función que se ejecuta ANTES de la validación.
    //    Intenta parsear el string. Si falla, devuelve un valor inválido que Zod atrapará.
    // 2. El segundo argumento es el schema que se aplica DESPUÉS de la transformación.
    //    Ahora validamos que el resultado sea un objeto con los campos correctos.
    cursorId: z.coerce.number().int().positive().optional(),
    cursorDate: z.string().datetime().optional() // Valida que sea una fecha en formato ISO
});