import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '#utils/customErrors.js';

/**
 * Middleware de autenticación estricto.
 * Verifica el token JWT. Si es inválido o no existe, devuelve un error 401.
 * Si es válido, adjunta el payload del usuario a `req.user`.
 */
export const isAuthenticated = (req, res, next) => {
    try {
        // Extraemos el token del encabezado de autorización
        const authHeader = req.headers.authorization;
        // Verificamos que el encabezado de autorización exista y tenga el formato correcto
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthorizedError('No se proporcionó token de autenticación.'); // Lanzamos un error de no autorizado si no hay token
        }
        const token = authHeader.split(' ')[1]; // Extraemos el token del encabezado
        // Verificamos y decodificamos el token
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = payload; // Adjuntamos la información del usuario decodificada al objeto de la solicitud
        next(); // Continuamos al siguiente middleware o controlador
    } catch (err) {
        // Si hay un error (token inválido, expirado, etc.), lanzamos un error de no autorizado
        next(new UnauthorizedError('Token de autenticación inválido o expirado.'));
    }
};

/**
 * Middleware de autenticación opcional (permisivo).
 * Intenta verificar un token JWT si existe. Si es válido, adjunta el payload a `req.user`.
 * NUNCA falla, siempre llama a `next()`. Es ideal para rutas públicas que pueden mostrar
 * contenido extra a usuarios logueados.
 */
export const authenticateOptional = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        try {
            const payload = jwt.verify(token, process.env.JWT_SECRET);
            req.user = payload; // Enriquece la request si el token es bueno
        } catch (error) {
            // Si el token es malo, simplemente lo ignoramos. req.user seguirá siendo undefined.
        }
    }
    next(); // Siempre continúa
};