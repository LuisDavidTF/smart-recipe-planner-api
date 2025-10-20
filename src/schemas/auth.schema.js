import {z} from 'zod';

export const registerSchema = z.object({
    name: z.string({
        required_error: 'El nombre es requerido.',
        invalid_type_error: 'El nombre debe ser una cadena de texto.'
    }).min(5, { message: 'El nombre debe tener al menos 5 caracteres.' }),
    /* Cambiar .string().email() cuando z.email tenga soporte para mensajes personalizados 
    ya que actualmente no lo tiene mientras que z.string().email({message}) 
    si lo tiene,a pesar de que esté deprecated */
    email: z.string({
        required_error: 'El email es requerido.'
    }).email({ message: 'El email debe tener un formato válido.' }), 
    password: z.string({
        required_error: 'La contraseña es requerida.',
        invalid_type_error: 'La contraseña debe ser una cadena de texto.'
    }).min(8, { message: 'La contraseña debe tener al menos 8 caracteres.' })
});

export const loginSchema = z.object({
    email: z.string({
        required_error: 'El email es requerido.'
    }).email({ message: 'El email debe tener un formato válido.' }),
    password: z.string({
        required_error: 'La contraseña es requerida.',
        invalid_type_error: 'La contraseña debe ser una cadena de texto.'
    }).min(8, { message: 'La contraseña debe tener al menos 8 caracteres.' })
});
