import prisma from '#config/prisma.js';

// Repositorio para crear un nuevo usuario
export async function createUser(data) {
  return await prisma.user.create({ data });// Creamos un nuevo usuario en la base de datos y retornamos el usuario creado
}

// Repositorio para loguear un usuario por su email
// Retorna el usuario encontrado o null si no existe
export async function loginUser(email) {
  return await prisma.user.findUnique({ where: { email } });// Buscamos un usuario por su email y retornamos el usuario encontrado
}