import { Router } from 'express';
import { registerController, loginController } from './auth.controller.js';
import { validateSchema } from '#middlewares/validateSchema.js';
import { registerSchema, loginSchema } from '#schemas/auth.schemas.js';
const router = Router();

// POST /api/v1/users/register - Ruta para registrar un nuevo usuario
router.post('/register', validateSchema(registerSchema), registerController); // Llamamos al controlador de registro
router.post('/login', validateSchema(loginSchema), loginController); // Llamamos al controlador de login
// Exportamos el enrutador
export default router;
