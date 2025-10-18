import { Router } from 'express';
import { registerController, loginController } from './auth.controller.js';

const router = Router();

// POST /api/v1/users/register - Ruta para registrar un nuevo usuario
router.post('/register', registerController); // Llamamos al controlador de registro
router.post('/login', loginController); // Llamamos al controlador de login
// Exportamos el enrutador
export default router;
