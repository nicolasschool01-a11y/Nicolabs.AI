import { GoogleGenAI } from "@google/genai";

// Initialize the client
// API Key is injected via process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = 'gemini-2.5-flash-image';

interface ImageInput {
  base64: string;
  mimeType: string;
}

export const editImageWithGemini = async (
  images: ImageInput[],
  prompt: string
): Promise<string> => {
  try {
    const parts = [];

    // Add all images to the request
    images.forEach(img => {
      parts.push({
        inlineData: {
          data: img.base64,
          mimeType: img.mimeType,
        },
      });
    });

    // Add the text prompt
    parts.push({
      text: prompt,
    });

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: parts,
      },
      // Config for Nano Banana / Gemini Flash Image
      config: {
        // Nano banana models do not support responseMimeType or responseSchema
      },
    });

    // Iterate through parts to find the image
    const responseParts = response.candidates?.[0]?.content?.parts;
    
    if (!responseParts) {
      throw new Error("No content generated");
    }

    for (const part of responseParts) {
      if (part.inlineData && part.inlineData.data) {
        return `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
      }
    }

    // If no image found, check for text indicating refusal or error
    const textPart = responseParts.find(p => p.text);
    if (textPart && textPart.text) {
      throw new Error(`Model returned text instead of image: ${textPart.text}`);
    }

    throw new Error("No image data found in response");

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "Failed to generate image");
  }
};

// Helper to convert File to Base64
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
};

// Helper to add watermark
export const addWatermark = async (base64Image: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = base64Image;
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(base64Image);
        return;
      }
      
      // Draw original image
      ctx.drawImage(img, 0, 0);

      // Configure Watermark
      const text = "Nicrolabs.AI";
      const fontSize = Math.floor(img.width * 0.08); // Responsive font size
      ctx.font = `900 ${fontSize}px Inter, sans-serif`;
      ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      
      // Add text shadow/stroke for better visibility
      ctx.strokeStyle = "rgba(0, 0, 0, 0.2)";
      ctx.lineWidth = fontSize / 20;

      // Draw Center Watermark (Diagonal)
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(-Math.PI / 6);
      ctx.strokeText(text, 0, 0);
      ctx.fillText(text, 0, 0);
      ctx.restore();

      // Draw small bottom right
      ctx.font = `600 ${fontSize * 0.4}px Inter, sans-serif`;
      ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
      ctx.textAlign = "right";
      ctx.textBaseline = "bottom";
      ctx.fillText("Demo Mode", canvas.width - 20, canvas.height - 20);

      resolve(canvas.toDataURL(img.src.startsWith('data:image/jpeg') ? 'image/jpeg' : 'image/png'));
    };
    img.onerror = (e) => reject(e);
  });
};