
export interface GeneratedImage {
  id: string;
  imageUrl: string;
  prompt: string;
  timestamp: number;
}

export interface ProcessingState {
  isLoading: boolean;
  error: string | null;
  statusMessage?: string;
}

export type AspectRatio = "1:1" | "3:4" | "4:3" | "16:9" | "9:16";

export interface UploadedImage {
  id: number;
  file: File;
  previewUrl: string;
}

export interface StyleOptions {
  business: string;
  vibe: string;
  lighting: string;
  camera: string;
  angle: string;
  format: string; // New field for Flyers/Covers
  is4K?: boolean;
}

export interface AppState {
  styleReference: UploadedImage | null;
}
