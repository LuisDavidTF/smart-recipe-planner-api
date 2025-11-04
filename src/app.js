import express, { json } from 'express';
import { jsonSyntaxErrorHandler } from '#middlewares/jsonSyntaxErrorHandler.js'; // Importamos el middleware para manejar errores de sintaxis JSON
import cors from 'cors';
import userRoutes from '#api/auth/auth.routes.js'; // Importamos nuestras rutas de usuario
import recipeRoutes from '#api/recipes/recipes.routes.js'; // Importamos nuestras rutas de recetas
import errorHandler from '#middlewares/errorHandler.js';// Importamos el middleware de manejo de errores
import aiRoutes from '#api/ai/ai.routes.js'; // Importamos nuestras rutas de AI

// Creamos la aplicación de Express

const app = express();
const port = process.env.PORT || 3000;

// Lista de dominios que tienen permiso
const allowedOrigins = [
    'http://localhost',
    'http://localhost:5173',
    'https://smart-recipe-planner.vercel.app'
];

const corsOptions = {
  origin: function (origin, callback) {
    // 1. Permite solicitudes sin origen (como las de Postman o apps móviles)
    if (!origin) {
        return callback(null, true);
    }
    
    // 2. Revisa si el origen está en la lista blanca
    if (allowedOrigins.indexOf(origin) !== -1) {
        return callback(null, true);
    }
    
    // 3. Revisa si el origen es de Canvas de Gemini
    if (origin.endsWith('.scf.usercontent.goog')) {
        return callback(null, true);
    }
    
    // 4. Si no es ninguno de los anteriores, lo rechaza
    callback(new Error('Acceso bloqueado por la política de CORS'));
  },
};

// Usa la configuración de CORS en todas las rutas
app.use(cors(corsOptions));


// Middleware para que Express entienda JSON
app.use(json());
app.use(express.json()); // Middleware para parsear bodies JSON
app.use(express.urlencoded({ extended: true })); // Middleware para parsear bodies urlencoded

// Usamos nuestras rutas de usuario con el prefijo /api/v1/users
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/recipes', recipeRoutes); // Usamos nuestras rutas de recetas con el prefijo /api/v1/recipes
app.use('/api/v1/ai', aiRoutes); // Usamos nuestras rutas de AI con el prefijo /api/v1/ai

// Middleware para manejar errores de sintaxis JSON
app.use(jsonSyntaxErrorHandler);

// Middleware para manejar errores
app.use(errorHandler);

// Iniciamos el servidor


// simulamos despertando el servidor la primera vez y se va a despertar a lo largo de 5 segundos como si fuera un servidor serverless


app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
