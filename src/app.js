import express, { json } from 'express';
import userRoutes from './api/auth/auth.routes.js'; // Importamos nuestras rutas de usuario
import errorHandler from '#middlewares/errorHandler.js';// Importamos el middleware de manejo de errores

// Creamos la aplicación de Express

const app = express();
const port = process.env.PORT || 3000;

// Middleware para que Express entienda JSON
app.use(json());

// Usamos nuestras rutas de usuario con el prefijo /api/v1/users
app.use('/api/v1/users', userRoutes);

// Middleware para manejar errores
app.use(errorHandler);

// Iniciamos el servidor

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
