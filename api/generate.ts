
import { GoogleGenAI, Type } from "@google/genai";
import { Request, Response } from 'express';

// This function runs on the server, so process.env is safe to use.
const apiKey = process.env.API_KEY;

// We initialize the client once when the server starts.
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

// Helper to map string types from the client to the SDK's Enum types
const mapSchema = (schema: any): any => {
    if (!schema) return undefined;
    if (typeof schema.type !== 'string' || !(schema.type in Type)) {
        // Fallback for invalid or unexpected type string
        return { ...schema, type: Type.TYPE_UNSPECIFIED };
    }
    const newSchema: any = { type: Type[schema.type as keyof typeof Type] };

    if (schema.properties) {
        newSchema.properties = {};
        for (const key in schema.properties) {
            newSchema.properties[key] = mapSchema(schema.properties[key]);
        }
    }
    if (schema.items) {
        newSchema.items = mapSchema(schema.items);
    }
    return newSchema;
};

// Express route handler
export const handleGenerate = async (req: Request, res: Response) => {
    if (!ai) {
      return res.status(500).json({ error: "API_KEY environment variable is not set." });
    }

    try {
        const { prompt, image, config } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required.' });
        }

        const parts: any[] = [{ text: prompt }];
        if (image && image.data && image.mimeType) {
            parts.push({ inlineData: { data: image.data, mimeType: image.mimeType } });
        }
        
        const mappedConfig = config ? {
            ...config,
            // Ensure responseSchema is correctly mapped or omitted if not present
            responseSchema: config.responseSchema ? mapSchema(config.responseSchema) : undefined
        } : undefined;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts },
            config: mappedConfig,
        });
        
        return res.status(200).json({ text: response.text });

    } catch (error) {
        console.error("Error in /api/generate:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        return res.status(500).json({ error: "Failed to generate content from the API.", details: errorMessage });
    }
};
