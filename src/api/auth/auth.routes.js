const { Router } = require('express');
const { registerController } = require('./auth.controller.js');
const router = Router();

// POST /api/v1/users/register - Ruta para registrar un nuevo usuario
router.post('/register', registerController);

module.exports = router;
