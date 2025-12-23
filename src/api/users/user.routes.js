import { Router } from "express";
import { updateUserProfileController, updateUserPasswordController } from "./user.controller.js";
import { isAuthenticated } from "#middlewares/authentication.js";
import { validateSchema } from "#middlewares/validateSchema.js";
import { updateProfileSchema, updatePasswordSchema } from "#schemas/user.schema.js";

const router = Router();

// PATCH /api/v1/users/update-profile
router.patch(
    "/update-profile", 
    isAuthenticated, 
    validateSchema(updateProfileSchema), 
    updateUserProfileController
);

// PATCH /api/v1/users/update-password
router.patch(
    "/update-password", 
    isAuthenticated, 
    validateSchema(updatePasswordSchema), 
    updateUserPasswordController
);

export default router;