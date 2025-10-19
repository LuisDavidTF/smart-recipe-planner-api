import { registerUser } from './auth.service.js';
import { BadRequestError, UnauthorizedError } from '#utils/customErrors.js';
// Controlador para registrar un nuevo usuario
export const registerController = async (req, res, next) => {
  const { name, email, password } = req.body; // Extraemos los datos del cuerpo de la solicitud
  // Validamos que todos los campos estén presentes
  if (!name || !email || !password) {
    throw new BadRequestError('Nombre, email y contraseña son requeridos.');// Lanzamos un error de solicitud incorrecta si faltan campos
  }
  try {// Llamamos al servicio para registrar el usuario
    const user = await registerUser({ name, email, password_hash: password });//Renombramos password a password_hash y lo pasamos al servicio
    res.status(201).json(user); // Respondemos con el usuario creado, aplicar cambios y solo mostrar id, name y email en la respuesta
  } catch (err) {
    //Cualquier error, ya sea nuestro o de la base de datos, se delega
    next(err);
  }
};

// Controlador para loguear un usuario
export const loginController = async (req, res, next) => {
  const { email, password } = req.body; // Extraemos los datos del cuerpo de la solicitud
  // Validamos que todos los campos estén presentes
  if (!email || !password) {
    throw new BadRequestError('Email y contraseña son requeridos.');// Lanzamos un error de solicitud incorrecta si faltan campos
  }
  try {
    const { loginUserService } = await import('./auth.service.js'); // Importamos el servicio para loguear el usuario
    const user = await loginUserService(email, password); // Llamamos al servicio para loguear el usuario
    if (!user) {
      throw new UnauthorizedError('Credenciales invalidas.');// Lanzamos un error de no autorizado si las credenciales son inválidas
    }
    res.status(200).json(user); // Si todo está bien, respondemos con el usuario
  } catch (err) {
    //Cualquier error, ya sea nuestro o de la base de datos, se delega
    next(err);
  }
};