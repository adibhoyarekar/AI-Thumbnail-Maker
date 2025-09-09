import { GoogleGenAI, Modality, GenerateContentResponse, Part, Type } from "@google/genai";
import { TextTone, TextStyle, BulkResult, BulkInputItem, CTRScoreResult } from "../types";

// Ensure the API key is being accessed from environment variables
const apiKey = process.env.API_KEY;
if (!apiKey) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey });

const WATERMARK_INSTRUCTION = "Important: Add a small, semi-transparent watermark in the bottom-right corner with the text 'ThumbExpert AI'.";

// Utility to convert a data URL to a GenerativePart
const dataUrlToGenerativePart = (dataUrl: string): Part => {
  const match = dataUrl.match(/^data:(.+);base64,(.+)$/);
  if (!match) {
    throw new Error("Invalid data URL format");
  }
  const mimeType = match[1];
  const data = match[2];
  return {
    inlineData: {
      mimeType,
      data,
    },
  };
};

export const generateThumbnailsFromPrompt = async (prompt: string, isPremium: boolean): Promise<string[]> => {
  try {
    const finalPrompt = isPremium ? prompt : `${prompt}. ${WATERMARK_INSTRUCTION}`;

    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: finalPrompt,
      config: {
        numberOfImages: 4,
        outputMimeType: 'image/jpeg',
        aspectRatio: '16:9',
      },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      return response.generatedImages.map(
        (image) => `data:image/jpeg;base64,${image.image.imageBytes}`
      );
    }
    return [];
  } catch (error) {
    console.error('Error generating thumbnails:', error);
    throw new Error('Failed to generate thumbnails. Please try again.');
  }
};

export const editThumbnail = async (
  base64ImageDataUrls: string[],
  prompt: string,
  isPremium: boolean
): Promise<{ text: string | null; imageUrl: string | null }> => {
  try {
    const imageParts = base64ImageDataUrls.map(dataUrlToGenerativePart);
    const finalPrompt = isPremium ? prompt : `${prompt}. ${WATERMARK_INSTRUCTION}`;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: {
        parts: [
          ...imageParts,
          { text: finalPrompt },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    let newImageUrl: string | null = null;
    let newText: string | null = null;

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.text) {
        newText = part.text;
      } else if (part.inlineData) {
        const { mimeType, data } = part.inlineData;
        newImageUrl = `data:${mimeType};base64,${data}`;
      }
    }

    if (!newImageUrl) {
        throw new Error("The model did not return an edited image.");
    }

    return { text: newText, imageUrl: newImageUrl };
  } catch (error) {
    console.error('Error editing thumbnail:', error);
    throw new Error('Failed to edit the thumbnail. Please adjust your prompt and try again.');
  }
};

export const suggestTitles = async (videoTopic: string): Promise<string[]> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `You are a YouTube expert specializing in viral titles. Given the video topic "${videoTopic}", generate 5 catchy, high-CTR YouTube titles.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        titles: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.STRING,
                            },
                        },
                    },
                    required: ['titles'],
                },
            },
        });

        const jsonStr = response.text.trim();
        const parsed = JSON.parse(jsonStr);
        return parsed.titles || [];

    } catch (error) {
        console.error("Error suggesting titles:", error);
        throw new Error("Failed to suggest titles. Please try again.");
    }
};

export const suggestCatchphrases = async (
    videoTopic: string, 
    audience: string,
    tone: TextTone,
    style: TextStyle,
    isPremium: boolean
): Promise<string[]> => {
    const numberOfPhrases = isPremium ? 5 : 3;
    let prompt = `You are a YouTube marketing expert. For a video about "${videoTopic}" targeted at a "${audience}" audience, generate ${numberOfPhrases} short, catchy, high-impact catchphrases (1-4 words) to put on a thumbnail. Include relevant emojis where appropriate.`;

    if (isPremium) {
        if (tone !== TextTone.Default) {
            prompt += ` The tone should be ${tone}.`;
        }
        if (style !== TextStyle.Default) {
            prompt += ` The style should be a ${style}.`;
        }
    }

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        catchphrases: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.STRING,
                            },
                            description: `An array of ${numberOfPhrases} catchphrases.`
                        },
                    },
                    required: ['catchphrases'],
                },
            },
        });

        const jsonStr = response.text.trim();
        const parsed = JSON.parse(jsonStr);
        return parsed.catchphrases || [];

    } catch (error) {
        console.error("Error suggesting catchphrases:", error);
        throw new Error("Failed to suggest catchphrases. Please try again.");
    }
};

export const batchSuggestCatchphrases = async (items: BulkInputItem[]): Promise<BulkResult[]> => {
    const promises = items.map(async (item) => {
        const { title, style } = item;
        try {
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: `For a YouTube video titled "${title}" with a "${style}" visual style, generate a single, short, catchy, high-impact catchphrase (1-4 words) to put on a thumbnail.`,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            catchphrase: {
                                type: Type.STRING,
                                description: 'A single, short, catchy phrase for the thumbnail.'
                            },
                        },
                        required: ['catchphrase'],
                    },
                },
            });
            const jsonStr = response.text.trim();
            const parsed = JSON.parse(jsonStr);
            return { title, style, suggestion: parsed.catchphrase || "No suggestion" };
        } catch (error) {
            console.error(`Error processing title "${title}":`, error);
            return { title, style, suggestion: "Generation failed" };
        }
    });

    try {
        const results = await Promise.all(promises);
        return results;
    } catch (error) {
        console.error("Error in batch suggestion process:", error);
        throw new Error("Failed to process the batch of titles. Please check your CSV and try again.");
    }
};

export const estimateCTRScore = async (
  base64ImageDataUrl: string,
  videoTitle: string
): Promise<CTRScoreResult> => {
  try {
    const imagePart = dataUrlToGenerativePart(base64ImageDataUrl);
    const prompt = `You are a YouTube thumbnail expert. Analyze the provided thumbnail image and the video title: "${videoTitle}". Provide an estimated Click-Through Rate (CTR) score out of 100 based on its potential to attract clicks. Also, provide a list of 2-3 specific, actionable suggestions for improvement. Focus on clarity, emotional impact, and visual composition.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [imagePart, { text: prompt }],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: {
              type: Type.INTEGER,
              description: 'The estimated CTR score from 0 to 100.'
            },
            feedback: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'A list of actionable feedback points.'
            },
          },
          required: ['score', 'feedback'],
        },
      },
    });

    const jsonStr = response.text.trim();
    const parsed = JSON.parse(jsonStr);
    
    if (typeof parsed.score !== 'number' || !Array.isArray(parsed.feedback)) {
      throw new Error("Invalid response format from the model.");
    }

    return parsed;

  } catch (error) {
    console.error("Error estimating CTR score:", error);
    throw new Error("Failed to estimate CTR score. The model may be unable to process this image.");
  }
};