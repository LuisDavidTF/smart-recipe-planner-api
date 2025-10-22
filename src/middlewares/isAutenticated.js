import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '#utils/customErrors.js';

// Middleware para verificar si el usuario está autenticado
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
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Adjuntamos la información del usuario decodificada al objeto de la solicitud
        next(); // Continuamos al siguiente middleware o controlador
    } catch (err) {
        // Si hay un error (token inválido, expirado, etc.), lanzamos un error de no autorizado
        next(new UnauthorizedError('Token de autenticación inválido o expirado.'));
    }
};