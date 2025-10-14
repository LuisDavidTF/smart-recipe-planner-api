// routes/users.js
const express = require('express');
const bcrypt = require('bcrypt');
const db = require('@config/db');; // Importamos nuestro módulo de base de datos

const router = express.Router();

// POST /api/v1/users/register - Ruta para registrar un nuevo usuario
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  // Validación simple
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Todos los campos son requeridos.' });
  }

  try {
    // 1. Encriptar la contraseña
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // 2. Insertar el nuevo usuario en la base de datos
    const queryText =
      'INSERT INTO users(name, email, password_hash) VALUES($1, $2, $3) RETURNING id, email, name, role, created_at';
    const values = [name, email, password_hash];
    
    const { rows } = await db.query(queryText, values);

    // 3. Enviar una respuesta exitosa
    res.status(201).json(rows[0]);
  } catch (err) {
    // Manejo de errores (ej: email duplicado)
    console.error(err.stack);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
});

module.exports = router;