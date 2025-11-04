import { z } from "zod";

export const generateRecipeSchema = z.object({
    prompt: z.string({
        required_error: "El prompt es requerido.",
        invalid_type_error: "El prompt debe ser una cadena de texto.",
    }).min(3, { message: "El prompt debe tener al menos 3 caracteres." }),
});
