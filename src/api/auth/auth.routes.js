import { Router } from 'express';
import { registerController, loginController } from './auth.controller.js';
import { validateSchema } from '#middlewares/validateSchema.js';
import { registerSchema, loginSchema } from '#schemas/auth.schema.js';
const router = Router();

// POST /api/v1/users/register - Ruta para registrar un nuevo usuario
router.post('/register', validateSchema(registerSchema), registerController); // pasamos el middleware de validación y el controlador

// POST /api/v1/users/login - Ruta para loguear un usuario
router.post('/login', validateSchema(loginSchema), loginController); // pasamos el middleware de validación y el controlador
// Exportamos el enrutador
export default router;
