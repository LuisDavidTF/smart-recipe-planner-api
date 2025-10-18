import { registerUser } from './auth.service.js';

// Controlador para registrar un nuevo usuario
export const registerController = async (req, res, next) => {
  const { name, email, password } = req.body; // Extraemos los datos del cuerpo de la solicitud
  // Validamos que todos los campos estén presentes
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Todos los campos son requeridos.' });
  }
  try {// Llamamos al servicio para registrar el usuario
    const user = await registerUser({ name, email, password_hash: password });//Renombramos password a password_hash y lo pasamos al servicio
    res.status(201).json(user); // Respondemos con el usuario creado, aplicar cambios y solo mostrar id, name y email en la respuesta
  } catch (err) {
    next(err);
  }
};

// Controlador para loguear un usuario
export const loginController = async (req, res, next) => {
  const { email, password } = req.body; // Extraemos los datos del cuerpo de la solicitud
  // Validamos que todos los campos estén presentes
  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña son requeridos.' });
  }
  try {
    const { loginUserService } = await import('./auth.service.js'); // Importamos el servicio para loguear el usuario
    const user = await loginUserService(email, password); // Llamamos al servicio para loguear el usuario
    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas.' });// Si las credenciales son inválidas, respondemos con un error 401
    }
    res.status(200).json(user); // Si todo está bien, respondemos con el usuario
  } catch (err) {
    next(err);
  }
};