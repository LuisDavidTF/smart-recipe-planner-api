import prisma from '#config/prisma.js';

// Repositorio para crear un nuevo usuario
export async function createUser(data) {
  return await prisma.user.create({ data });// Creamos un nuevo usuario en la base de datos y retornamos el usuario creado
}