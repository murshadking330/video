
import { GoogleGenAI, Type } from "@google/genai";
import { GeminiResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateVideoInsights = async (filename: string, size: number): Promise<GeminiResponse> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze this video upload: Filename: "${filename}", Size: ${size} bytes. Generate metadata for a short-link sharing service.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          slug: {
            type: Type.STRING,
            description: "A unique, creative 6-8 character alphanumeric slug for the short URL.",
          },
          title: {
            type: Type.STRING,
            description: "A catchy, click-worthy title based on the filename.",
          },
          description: {
            type: Type.STRING,
            description: "A short professional description for the video.",
          },
          tags: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "3-5 relevant hashtags.",
          },
        },
        required: ["slug", "title", "description", "tags"],
      },
    },
  });

  try {
    return JSON.parse(response.text.trim());
  } catch (error) {
    console.error("Failed to parse Gemini response", error);
    return {
      slug: Math.random().toString(36).substring(2, 8),
      title: filename.split('.')[0],
      description: "No description generated.",
      tags: ["video", "upload"],
    };
  }
};
