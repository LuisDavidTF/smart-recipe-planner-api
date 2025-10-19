import { HttpError } from '../utils/customErrors.js';

const errorHandler = (err, req, res, next) => {
  // En futuro cambiar por un sistema de logging más robusto si es necesario como Winston, Bunyan o Pino
  console.error(err); // Logueamos el error para depuración
  // Errores especificos Prisma y validaciones
  if (err.code === 'P2002') { // Error de Prisma por violación de unicidad
    return res.status(409).json({ error: 'El email ya está registrado.' });// Conflict status code si el email ya está registrado
  }
  if (err.name === 'ValidationError') { // Error de validación
    return res.status(400).json({ error: err.message });// Bad Request status code para errores de validación
  }

  // Errores personalizados con código de estado HTTP
  if (err instanceof HttpError) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  // Fallback para cualquier otro error inesperado
  res.status(500).json({ error: 'Error interno del servidor.' });
};

export default errorHandler;