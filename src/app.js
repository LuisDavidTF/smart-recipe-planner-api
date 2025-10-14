// index.js
require('module-alias/register');
require('dotenv').config();

const express = require('express');
const userRoutes = require('./api/auth/auth.routes.js'); // Importamos nuestras rutas de usuario

const app = express();
const port = process.env.PORT || 3000;

// Middleware para que Express entienda JSON
app.use(express.json());

// Usamos nuestras rutas de usuario con el prefijo /api/v1/users
app.use('/api/v1/users', userRoutes);

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});