import prisma from '#config/prisma.js';
import { create } from '../recipes/recipes.repository';

/**
 * Crea un nuevo usuario
 * @param {*} data 
 * @returns {Promise<import('@prisma/client').User>} Usuario creado
 */
export async function createUser(data) {
  return await prisma.user.create({ data });// Creamos un nuevo usuario en la base de datos y retornamos el usuario creado
}

/**
 * Inicia sesión un usuario por su email
 * @param {*} email 
 * @returns {Promise<import('@prisma/client').User | null>} Usuario encontrado o null si no existe
 */
export async function loginUser(email) {
  return await prisma.user.findUnique({ where: { email } });// Buscamos un usuario por su email y retornamos el usuario encontrado
}

/**
 * Obtiene un usuario por su ID
 * @param {*} id 
 * @returns {Promise<import('@prisma/client').User | null>} Usuario encontrado o null si no existe
 */
export async function getUserById(id) {
  return await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      profile_picture_url: true,
      role: true,
      createdAt: true
    }
  });// Buscamos un usuario por su ID y retornamos el usuario encontrado
}