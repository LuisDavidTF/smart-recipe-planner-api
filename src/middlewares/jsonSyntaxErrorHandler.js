import { BadRequestError } from '#utils/customErrors.js';

/**
 * Middleware de manejo de errores para capturar errores de sintaxis en el JSON del body.
 * Express lanza un SyntaxError cuando el middleware express.json() no puede parsear el body.
 * Este middleware intercepta ese error específico y lo convierte en una respuesta 400 Bad Request
 * con un mensaje claro, en lugar de dejar que se convierta en un 500 Internal Server Error.
 *
 * @param {Error} err - El objeto de error.
 * @param {import('express').Request} req - El objeto de solicitud de Express.
 * @param {import('express').Response} res - El objeto de respuesta de Express.
 * @param {import('express').NextFunction} next - La función para pasar al siguiente middleware.
 */
export const jsonSyntaxErrorHandler = (err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return next(new BadRequestError('El cuerpo de la solicitud contiene JSON mal formado.'));
  }
  next(err);
};
