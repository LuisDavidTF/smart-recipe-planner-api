import { createUser } from '../users/user.repository.js';
// Servicio para registrar un nuevo usuario
export async function registerUser(data) {
  const bcrypt = await import('bcrypt'); // Importamos bcrypt dinámicamente
  const salt = await bcrypt.genSalt(10); // Generamos un salt
  data.password_hash = await bcrypt.hash(data.password_hash, salt);// Hasheamos la contraseña
  const user = await createUser(data); // Creamos el usuario en la base de datos
  return user;
}