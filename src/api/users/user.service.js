import { updateUserProfile, updatePassword, loginUser } from '#users/user.repository.js';
import bcrypt from 'bcrypt';
import { UnauthorizedError, NotFoundError } from '#utils/customErrors.js';

/**
 * Actualiza el perfil de un usuario.
 * @param {number} userId - El ID del usuario a actualizar.
 * @param {Object} profileData - Los datos del perfil validados.
 */
export const updateUserProfileService = async (userId, profileData) => {
  try {
    return user = await updateUserProfile(userId, profileData);
  } catch (error) {
    throw new NotFoundError('Usuario no encontrado.');
  }
};

/**
 * Actualiza la contraseña de un usuario.
 * @param {number} userId - El ID del usuario a actualizar.
 * @param {string} email - El email del usuario.
 * @param {string} currentPassword - La contraseña actual en texto plano.
 * @param {string} newPassword - La nueva contraseña en texto plano.
 * @throws {UnauthorizedError} Si la contraseña actual es incorrecta.
 * @returns {Promise<void>}
 */
export const updateUserPasswordService = async (userId, email, currentPassword, newPassword) => {
  const user = await loginUser(email);
  const isPasswordValid = await bcrypt.compare(currentPassword, user.password_hash);
  if (!isPasswordValid) {
    throw new UnauthorizedError('Contraseña actual incorrecta.');
  }
  const salt = await bcrypt.genSalt(10);
  const newPasswordHash = await bcrypt.hash(newPassword, salt);
  await updatePassword(userId, newPasswordHash);
};
