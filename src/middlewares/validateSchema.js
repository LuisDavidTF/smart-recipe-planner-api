// Puede recibir cualquier esquema de validacion de zod y devolver un middleware de Express

import { BadRequestError } from '#utils/customErrors.js';

//Este middleware es una funcion que devuelve otra funcion (el middleware en si)
// Recibe un esquema de validacion de zod como parametro
export const validateSchema = (schema) => {
  return (req, res, next) => {
    try {
        // Validamos el cuerpo de la solicitud contra el esquema proporcionado
        // Usamos parse para que lance un error si no es valido
      schema.parse(req.body);
      next();// Si es valido, pasamos al siguiente middleware
    } catch (error) {
        // Si no es valido, formateamos los errores y los pasamos al siguiente middleware de manejo de errores
        const formattedErrors = error.errors.map(err => (err.message));
        const validationError= new BadRequestError(formattedErrors.join(', '));
        next(validationError); // Pasamos el error al siguiente middleware
    }
  };
};