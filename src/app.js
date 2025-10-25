import express, { json } from 'express';
import { jsonSyntaxErrorHandler } from '#middlewares/jsonSyntaxErrorHandler.js'; // Importamos el middleware para manejar errores de sintaxis JSON
import userRoutes from '#api/auth/auth.routes.js'; // Importamos nuestras rutas de usuario
import recipeRoutes from '#api/recipes/recipes.routes.js'; // Importamos nuestras rutas de recetas
import errorHandler from '#middlewares/errorHandler.js';// Importamos el middleware de manejo de errores

// Creamos la aplicación de Express

const app = express();
const port = process.env.PORT || 3000;

// Middleware para que Express entienda JSON
app.use(json());
app.use(express.json()); // Middleware para parsear bodies JSON
app.use(express.urlencoded({ extended: true })); // Middleware para parsear bodies urlencoded

// Usamos nuestras rutas de usuario con el prefijo /api/v1/users
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/recipes', recipeRoutes); // Usamos nuestras rutas de recetas con el prefijo /api/v1/recipes

// Middleware para manejar errores de sintaxis JSON
app.use(jsonSyntaxErrorHandler);

// Middleware para manejar errores
app.use(errorHandler);

// Iniciamos el servidor

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
