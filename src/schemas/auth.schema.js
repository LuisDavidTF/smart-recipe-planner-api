import {z} from 'zod';

export const registerSchema = z.object({
    name: z.string({required_error: 'El nombre es requerido.',
        invalid_type_error: 'El nombre debe ser una cadena de texto.'
    }).min(5, 'El nombre debe tener al menos 5 caracteres.'),
    email: z.email({required_error: 'El email es requerido.',
        invalid_type_error: 'El email debe tener un formato válido.'
    }),
    password: z.string({required_error: 'La contraseña es requerida.',
        invalid_type_error: 'La contraseña debe ser una cadena de texto.'
    }).min(8, 'La contraseña debe tener al menos 8 caracteres.')
});

export const loginSchema = z.object({
    email: z.email({required_error: 'El email es requerido.',
        invalid_type_error: 'El email debe tener un formato válido.'
    }),
    password: z.string({required_error: 'La contraseña es requerida.',
        invalid_type_error: 'La contraseña debe ser una cadena de texto.'
    }).min(8, 'La contraseña debe tener al menos 8 caracteres.')
});