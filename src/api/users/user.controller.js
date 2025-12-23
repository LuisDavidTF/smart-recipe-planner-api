import { updateUserProfileService, updateUserPasswordService } from '#users/user.service.js';

/**
 * Controlador para actualizar el perfil de un usuario.
 * @param {import('express').Request} req - La solicitud HTTP.
 * @param {import('express').Response} res - La respuesta HTTP.
 * @returns {Promise<void>}
 */
export const updateUserProfileController = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const profileData = req.validated.body;
        const updatedProfile = await updateUserProfileService(userId, profileData);
        res.status(200).json(updatedProfile);
    } catch (error) {
        next(error);
    }
};

/**
 * Controlador para actualizar la contraseña de un usuario.
 * @param {import('express').Request} req - La solicitud HTTP.
 * @param {import('express').Response} res - La respuesta HTTP.
 * @returns {Promise<void>}
 */
export const updateUserPasswordController = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { email, currentPassword, newPassword } = req.validated.body;
        await updateUserPasswordService(userId, email, currentPassword, newPassword);
        res.status(200).json({ message: 'Contraseña actualizada exitosamente' });
    } catch (error) {
        next(error);
    }
};