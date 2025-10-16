import { registerUser } from './auth.service.js';
// Controlador para registrar un nuevo usuario
export const registerController = async (req, res) => {
  const { name, email, password } = req.body; // Extraemos los datos del cuerpo de la solicitud
  // Validamos que todos los campos estén presentes
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Todos los campos son requeridos.' });
  }
  try {// Llamamos al servicio para registrar el usuario
    const user = await registerUser({ name, email, password_hash: password });//Renombramos password a password_hash y lo pasamos al servicio
    res.status(201).json(user); // Respondemos con el usuario creado, aplicar cambios y solo mostrar id, name y email en la respuesta
  } catch (err) {
    // Manejamos cualquier error que pueda ocurrir durante el registro
    if (err.code === 'P2002') { // Error de Prisma por violación de unicidad
      return res.status(409).json({ error: 'El email ya está registrado.' });// Conflict status code si el email ya está registrado
    }
    else {
      console.error(err);
      res.status(500).json({ error: 'Error interno del servidor.' });
    }
  }
};
