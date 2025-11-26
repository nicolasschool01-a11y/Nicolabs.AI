
import { GoogleGenAI } from "@google/genai";

// Initialize the client
// API Key is injected via process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

interface ImageInput {
  base64: string;
  mimeType: string;
}

export const editImageWithGemini = async (
  productImages: ImageInput[],
  prompt: string,
  styleReferenceImage?: ImageInput,
  aspectRatio: string = "1:1",
  is4K: boolean = false
): Promise<string> => {
  try {
    const parts = [];

    // 1. Add Product Images (Subject)
    productImages.forEach(img => {
      parts.push({
        inlineData: {
          data: img.base64,
          mimeType: img.mimeType,
        },
      });
    });

    // 2. Add Style Reference Image (Optional)
    if (styleReferenceImage) {
      parts.push({
        inlineData: {
          data: styleReferenceImage.base64,
          mimeType: styleReferenceImage.mimeType,
        }
      });
    }

    // 3. Add the text prompt
    parts.push({
      text: prompt,
    });

    // Determine Model
    // Use Pro model for non-square aspect ratios or 4K requests for better adherence
    // Use Flash for standard 1:1 fast generations
    const model = (aspectRatio !== '1:1' || is4K) 
      ? 'gemini-3-pro-image-preview' 
      : 'gemini-2.5-flash-image';

    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: parts,
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio,
          // Only request high res if using the Pro model
          imageSize: (is4K && model === 'gemini-3-pro-image-preview') ? '4K' : undefined 
        }
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

// Helper to analyze business description and suggest styles
export const getStyleSuggestions = async (description: string, validOptions: any) => {
  try {
    const systemPrompt = `
      You are an expert Creative Director and Photographer.
      Your task is to analyze a user's business description and goal, and map it to the BEST available style presets from the provided list.
      
      USER DESCRIPTION: "${description}"

      AVAILABLE OPTIONS JSON STRUCTURE (You must pick ONE value ID/Value for each category):
      - business: ${JSON.stringify(validOptions.business.map((o: any) => ({id: o.id, label: o.label})))}
      - vibe: ${JSON.stringify(validOptions.vibe.map((o: any) => o.value))}
      - lighting: ${JSON.stringify(validOptions.lighting.map((o: any) => o.value))}
      - camera: ${JSON.stringify(validOptions.camera.map((o: any) => o.value))}
      - angle: ${JSON.stringify(validOptions.angle.map((o: any) => o.value))}
      - format: ${JSON.stringify(validOptions.format.map((o: any) => ({id: o.id, label: o.label})))}

      OUTPUT FORMAT:
      Return ONLY a raw JSON object (no markdown, no backticks) with the following keys:
      {
        "businessId": "string (id from options)",
        "vibeValue": "string (exact value from options)",
        "lightingValue": "string (exact value from options)",
        "cameraValue": "string (exact value from options)",
        "angleValue": "string (exact value from options)",
        "formatId": "string (id from options)",
        "suggestedPromptAddon": "A short, 1-sentence creative instruction to add to the prompt based on their specific request (e.g. 'Add smoke effects' or 'Place on a wooden table')"
      }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: systemPrompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const text = response.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error("No suggestion generated");
    
    return JSON.parse(text);

  } catch (error) {
    console.error("Style Suggestion Error:", error);
    return null;
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
