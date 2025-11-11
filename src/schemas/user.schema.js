import {z} from 'zod';

export const updateProfileSchema = z.object({
    name: z.string({
        invalid_type_error: 'El nombre debe ser una cadena de texto.'
    }).min(5, { message: 'El nombre debe tener al menos 5 caracteres.' }).optional(),
    profile_picture_url: z.string({
        invalid_type_error: 'La URL de la imagen debe ser una cadena de texto.'
    }).url({ message: 'La URL de la imagen debe ser una URL válida.' }).optional(),
});

export const updatePasswordSchema = z.object({
    email: z.string({
        invalid_type_error: 'El email debe ser una cadena de texto.'
    }).email({ message: 'El email debe ser un email válido.' }),
    currentPassword: z.string({
        required_error: 'La contraseña actual es requerida.',
        invalid_type_error: 'La contraseña actual debe ser una cadena de texto.'
    }).min(8, { message: 'La contraseña actual debe tener al menos 8 caracteres.' }),
    newPassword: z.string({
        required_error: 'La nueva contraseña es requerida.',
        invalid_type_error: 'La nueva contraseña debe ser una cadena de texto.'
    }).min(8, { message: 'La nueva contraseña debe tener al menos 8 caracteres.' }),
});