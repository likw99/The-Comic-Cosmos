import { GoogleGenAI, Type, Modality } from "@google/genai";
import type { ComicPanel, ComicData } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const expertSchema = {
    type: Type.OBJECT,
    properties: {
        name: {
            type: Type.STRING,
            description: "The full name of the identified expert."
        },
        description: {
            type: Type.STRING,
            description: "A brief, one-sentence visual description of the expert for an illustrator (e.g., 'Albert Einstein with his iconic wild white hair and mustache')."
        }
    },
    required: ["name", "description"],
};

const storySchema = {
    type: Type.OBJECT,
    properties: {
        title: {
            type: Type.STRING,
            description: "A catchy, comic-book style title for the story."
        },
        panels: {
            type: Type.ARRAY,
            description: "An array of exactly 4 comic panels.",
            items: {
                type: Type.OBJECT,
                properties: {
                    scene: {
                        type: Type.INTEGER,
                        description: "The panel number, starting from 1."
                    },
                    description: {
                        type: Type.STRING,
                        description: "A detailed visual description of the scene for an illustrator. Focus on a single key moment. Do not include any text or speech bubbles in the description."
                    },
                    narration: {
                        type: Type.STRING,
                        description: "The narration or text that will appear in this panel. Keep it concise."
                    }
                },
                required: ["scene", "description", "narration"],
            }
        },
        summary: {
            type: Type.STRING,
            description: "A brief, one-paragraph summary of the key concepts explained in the comic."
        }
    },
    required: ["title", "panels", "summary"],
};

export async function identifyExpert(question: string): Promise<{ name: string; description: string; }> {
    const prompt = `For the question: "${question}", identify the single most famous and visually recognizable historical expert or scientist related to this topic. Provide their name and a brief, one-sentence visual description for an illustrator.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: expertSchema,
            },
        });

        const jsonText = response.text.trim();
        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Error identifying expert:", error);
        throw new Error("Could not identify a suitable expert for this topic.");
    }
}


export async function generateStoryAndScript(question: string, level: string, expertName: string): Promise<ComicData> {
    const prompt = `Create a comic book script that answers the question: "${question}". The story should be narrated and guided by the famous expert, ${expertName}. The explanation should be tailored ${level}. The comic should have a clear beginning, middle, and end, breaking down the concept into exactly 4 simple, visual scenes. Provide a title, a summary, and details for each panel.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: storySchema,
            },
        });
        
        const jsonText = response.text.trim();
        const data = JSON.parse(jsonText) as ComicData;
        
        if (!data.panels || data.panels.length === 0) {
            throw new Error("AI failed to generate comic panels.");
        }
        return data;

    } catch (error) {
        console.error("Error generating story script:", error);
        throw new Error("Failed to generate the comic's story. The model might be unable to process this request.");
    }
}

export async function generateComicImage(panelDescription: string, level: string, expertDescription: string): Promise<string> {
    const expertInstruction = `The scene features ${expertDescription} explaining the concept.`;
    const imagePrompt = `Create a vibrant, simple, and clear comic book panel illustration. The style should be friendly and educational, suitable ${level}. Do not include any text, speech bubbles, or panel borders. The scene is: "${panelDescription}". ${expertInstruction} Maintain the comic style consistently.`;
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image-preview',
            contents: imagePrompt,
            config: {
                responseModalities: [Modality.IMAGE, Modality.TEXT],
            },
        });

        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData && part.inlineData.data) {
                return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
            }
        }
        throw new Error("No image was generated by the model.");

    } catch (error) {
        console.error("Error generating comic image:", error);
        throw new Error("Failed to draw a comic panel.");
    }
}