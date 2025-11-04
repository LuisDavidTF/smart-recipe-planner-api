import { Router } from 'express';
import { registerController, loginController, getMeController } from '#auth/auth.controller.js';
import { validateSchema } from '#middlewares/validateSchema.js';
import { registerSchema, loginSchema } from '#schemas/auth.schema.js';
import { isAuthenticated } from '#middlewares/authentication.js';

const router = Router();

// POST /api/v1/users/register - Ruta para registrar un nuevo usuario
router.post('/register', validateSchema(registerSchema), registerController); // pasamos el middleware de validación y el controlador

// POST /api/v1/users/login - Ruta para loguear un usuario
router.post('/login', validateSchema(loginSchema), loginController); // pasamos el middleware de validación y el controlador

// GET /api/v1/users/me - Ruta para obtener los datos del usuario autenticado
router.get('/me', isAuthenticated, getMeController); // pasamos el middleware de autenticación y el controlador

// Exportamos el enrutador
export default router;
