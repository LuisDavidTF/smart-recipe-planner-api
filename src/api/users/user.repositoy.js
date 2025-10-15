import prisma from '../../config/prisma.js';


export async function createUser(data) {
  return await prisma.user.create({ data });
}