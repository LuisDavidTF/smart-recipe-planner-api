import { createUser } from '#users/user.repository.js';
import { loginUser } from '#users/user.repository.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Servicio para registrar un nuevo usuario
export async function registerUser(data) {
  const salt = await bcrypt.genSalt(10); // Generamos un salt
  data.password_hash = await bcrypt.hash(data.password_hash, salt);// Hasheamos la contraseña
  const user = ((await createUser(data)).id); // Creamos el usuario en la base de datos

  //iniciamos sesión automáticamente al registrar el usuario
  ///...

  return user;// Devolvemos el ID del usuario creado
}

// Servicio para loguear un usuario
export async function loginUserService(email, password) {
  const user = await loginUser(email);// Buscamos el usuario por su email
  if (!user) {
    return null;// Si no existe el usuario, retornamos null
  }
  const isPasswordValid = await bcrypt.compare(password, user.password_hash);// Comparamos la contraseña
  if (!isPasswordValid) {
    return null;// Si la contraseña no es válida, retornamos null
  }
  //Si la autenticacion es exitosa, retornamos un JWT (JSON Web Token) con Id y rol del usuario
  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });// Generamos el token JWT
  return { id: user.id, name: user.name, email: user.email, token };// Devolvemos los datos del usuario junto con el token
}