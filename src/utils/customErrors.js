// src/utils/customErrors.js

/**
 * Clase base para todos nuestros errores de aplicación que tienen un código de estado HTTP.
 * @param {string} message - El mensaje de error para el cliente.
 * @param {number} statusCode - El código de estado HTTP (e.g., 400, 404, 401).
 */
class HttpError extends Error {
    constructor(message, statusCode) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Error para solicitudes incorrectas del cliente (HTTP 400).
 * Usar cuando faltan datos o tienen un formato inválido.
 */
export class BadRequestError extends HttpError {
  constructor(message = 'Solicitud incorrecta.') {
    super(message, 400);
  }
}

/**
 * Error para intentos de acceso no autorizados (HTTP 401).
 * Usar para credenciales incorrectas.
 */
export class UnauthorizedError extends HttpError {
  constructor(message = 'Credenciales inválidas.') {
    super(message, 401);
  }
}

/**
 * Error para conflictos de recursos existentes (HTTP 409).
 * Perfecto para cuando un email ya está registrado.
 */
export class ConflictError extends HttpError {
  constructor(message = 'El recurso ya existe.') {
    super(message, 409);
  }
}

export { HttpError };