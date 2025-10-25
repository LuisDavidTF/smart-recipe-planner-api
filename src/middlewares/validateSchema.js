// Puede recibir cualquier esquema de validacion de zod y devolver un middleware de Express

import { ZodError } from 'zod';
import { BadRequestError } from '#utils/customErrors.js';

/**
 * Middleware de validación genérico que usa Zod.
 * Puede validar tanto `req.body` como `req.query`.
 * @param {z.ZodSchema<any>} schema - El esquema de Zod a aplicar.
 * @param {'body' | 'query' | 'params'} source - La propiedad del objeto `req` que se debe validar.
 * @returns {Function} El middleware de Express configurado.
 */

export const validateSchema = (schema, source = 'body') => (req, res, next) => {
    try {
        // Usamos la propiedad `source` para acceder dinámicamente a req.body o req.query.
        const dataToValidate = req[source];

        // Usamos `parse` para validar y transformar los datos.
        // Si falla, Zod lanzará un error que será atrapado por el `catch`.
        const validatedData = schema.parse(dataToValidate);

        // Creamos una nueva propiedad para almacenar los datos validados.
        // Esto asegura que el controlador reciba datos seguros y predecibles.
        // Usamos Object.assign para fusionar los datos validados en lugar de sobrescribirlos.
        // Esto es útil cuando se encadenan múltiples validaciones (ej. params y body).
        // Creamos una propiedad específica para cada fuente de datos.
        // Usamos 'body' y 'query' como claves en un objeto `validated`.
        if (!req.validated) {
            req.validated = {};
        }
        req.validated[source] = validatedData;

        next();
    } catch (error) {
        // Verificamos si el error es una instancia de ZodError.
        if (error instanceof ZodError) {
            // Si es un error de Zod, lo formateamos y lo pasamos a nuestro errorHandler.
            const formattedErrors = error.issues.map(err => err.message);
            const validationError = new BadRequestError(formattedErrors.join(', '));
            return next(validationError);
        }
        // Si no es un error de Zod, lo pasamos al siguiente manejador de errores.
        next(error);
    }
};