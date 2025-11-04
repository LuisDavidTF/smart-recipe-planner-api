import { registerUser, loginUserService, getUserByIdService } from '#auth/auth.service.js';

// Controlador para registrar un nuevo usuario
export const registerController = async (req, res, next) => {
  const { name, email, password } = req.validated.body; // Extraemos los datos del cuerpo de la solicitud
  
  // No necesitamos validar aquí porque el middleware de validación ya lo hizo

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
  const { email, password } = req.validated.body; // Extraemos los datos del cuerpo de la solicitud
  
  // No necesitamos validar aquí porque el middleware de validación ya lo hizo

  try {
    const user = await loginUserService(email, password); // Llamamos al servicio para loguear el usuario
    res.status(200).json(user); // Si todo está bien, respondemos con el usuario
  } catch (err) {
    //Cualquier error, ya sea nuestro o de la base de datos, se delega
    next(err);
  }
};


/**
 * Controlador para obtener los datos del usuario autenticado (me).
 * @param {object} req - La solicitud HTTP.
 * @param {object} res - La respuesta HTTP.
 * @param {function} next - La función para pasar al siguiente middleware en caso de error.
 */

export const getMeController = async (req, res, next) => {
  try {
    const userId = req.user.id; // Extraemos el ID del usuario del payload del token JWT
    const user = await getUserByIdService(userId); // Llamamos al servicio para obtener los datos del usuario
    res.status(200).json(user); // Respondemos con los datos del usuario
  } catch (err) {
    //Cualquier error, ya sea nuestro o de la base de datos, se delega
    next(err);
  }
};