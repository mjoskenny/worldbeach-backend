// types/spaces.ts

export interface SpaceImage {
  file?: File;        // uploaded file (new)
  url?: string;       // existing image URL (from backend)
  preview?: string;   // local preview
}

export interface Space {
  id: string;
  name: string;
  description: string;
  capacity: number;
  price: number;
  image: { file?: File; url?: string; preview?: string } | null; // keep as object
  features: string[];
  category: "indoor" | "outdoor" | "private";
}

