import { z } from 'zod';

export const createRecipeSchema = z.object({
    name: z.string({ required_error: 'El nombre de la receta es obligatorio' }).min(3),
    description: z.string({ required_error: 'La descripción de la receta es obligatoria' }).min(10),
    image_url: z.string({ required_error: 'La URL de la imagen es obligatoria' }).url(),
    preparation_time_minutes: z.number({ required_error: 'El tiempo de preparación es obligatorio' }).int().positive(),
    type: z.enum(['breakfast', 'lunch', 'dinner'], { required_error: 'El tipo de receta es obligatorio' }),
    visibility: z.enum(['public', 'private']).optional().default('private'),

    instruccions: z.record(z.string(), { required_error: 'Las instrucciones son requeridas.' }),

    ingredients: z.array(z.object({
        name: z.string(),
        quantity: z.string(),
        unit_of_measure: z.string()
    })).min(1, { message: 'La receta debe tener al menos un ingrediente.' }),

    media: z.array(z.object({
        url: z.string().url(),
        media_type: z.enum(['image', 'video']),
        display_order: z.number().int()
    })).optional()
});
