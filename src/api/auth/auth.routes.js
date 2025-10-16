import { Router } from 'express';
import { registerController } from './auth.controller.js';

const router = Router();

// POST /api/v1/users/register - Ruta para registrar un nuevo usuario
router.post('/register', registerController);

export default router;
