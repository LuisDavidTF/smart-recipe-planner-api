import { getUserById, updateGenerationCounter } from "#users/user.repository.js";
import { GoogleGenAI } from "@google/genai";
import { InternalServerError, TooManyRequestsError } from "#utils/customErrors.js";

const GEMINI_RESPONSE_SCHEMA = {
    type: "object",
    properties: {
        name: {
            type: "string",
            description: "El título de la receta.",
        },
        description: {
            type: "string",
            description: "Una breve descripción de la receta.",
        },
        preparationTime: {
            type: "number",
            description: "Tiempo total de preparación en minutos.",
        },
        ingredients: {
            type: "array",
            description: "Lista de ingredientes.",
            items: {
                type: "object",
                properties: {
                    name: { type: "string" },
                    quantity: {
                        type: "string",
                        description: "Valor numérico (ej: '2', '150', '0.5'). Si no es numérico, dejar en blanco.",
                    },
                    unit_of_measure: {
                        type: "string",
                        description: "Descriptor textual (ej: 'gramos', 'tazas', 'al gusto').",
                    },
                },
                required: ["name", "quantity", "unit_of_measure"],
            },
        },
        instructions: {
            type: "array",
            description: "Instrucciones paso a paso.",
            items: { type: "string" },
        },
        type: {
            type: "string",
            enum: ["breakfast", "lunch", "dinner"],
            description: "Tipo de comida para la receta.",
        },
    },
    required: ["name", "description", "preparationTime", "ingredients", "instructions", "type"],
};

// 3. Tu system prompt (se queda igual)
const systemPrompt = `
You are a professional multilingual culinary assistant.
Detect the user's language automatically and generate the recipe using that language for all text content.
Always keep JSON structure and field names in English, as defined in the schema.

Formatting rules for ingredients:
- "quantity" must contain only numeric values (e.g., "1", "200", "0.5").
- If the quantity is qualitative or not numeric (like "to taste", "a pinch", "a few"), 
  leave "quantity" empty ("") and write that description in "unit_of_measure".
- "unit_of_measure" should contain units or descriptive terms such as "grams", "cups", "to taste", "al gusto", etc.

Examples:
✅ Correct:
{
  "name": "Salt",
  "quantity": "",
  "unit_of_measure": "to taste"
}

❌ Incorrect:
{
  "name": "Salt",
  "quantity": "to taste",
  "unit_of_measure": ""
}

Return only valid JSON following the schema. No extra commentary or markdown.
`;

export async function generateRecipeService(userId, prompt) {
    const user = await getUserById(userId);
    if (!user)
        throw new InternalServerError('User not found');

    // Check generation limits
    const now = new Date();
    const lastGen = new Date(user.lastGenerationAt);
    const diffHours = (now - user.lastGenerationAt) / (1000 * 60 * 60);

    let newCount = user.generationCount;
    let newTimestamp = lastGen;

    if (diffHours >= 24) {
        newCount = 1;
        newTimestamp = now;
    } else if (user.generationCount < 3) {
        newCount++;
    } else {
        throw new TooManyRequestsError('Has alcanzado el límite de 3 generaciones de recetas por día.');
    }

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

        const fullPrompt = `${systemPrompt}\n\nUser request: ${prompt}`;


        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: fullPrompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: GEMINI_RESPONSE_SCHEMA,
                temperature: 0.6,
            },
        });

        await updateGenerationCounter(userId, newCount, newTimestamp);

        return JSON.parse(response.text);

    } catch (error) {
        console.error("Error en la API de Gemini:", error);
        throw new InternalServerError('Hubo un error al generar la receta.');
    }
}
