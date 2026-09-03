export type ProcessingStage = 
  | "LOOKING" 
  | "UNDERSTANDING" 
  | "WRITING" 
  | "PRICING" 
  | "MARKETING" 
  | "COMPLETE";

export type ImageUploadStatus = 
  | "EMPTY" 
  | "DRAGGING" 
  | "VALIDATING" 
  | "PREVIEW" 
  | "UPLOADING" 
  | "READY" 
  | "ERROR";

export type WorkspaceTab = 
  | "LISTING" 
  | "PRICING" 
  | "MARKETING" 
  | "REACH" 
  | "READINESS";

export interface ProductFormData {
  productName?: string;
  material: string;
  // Deliberately a string here (raw form input, may include currency symbols/commas) — callers
  // must parse it to a number before it reaches ProductInputData/VisartInput (types/visart.ts),
  // which use `number`. See lib/frontend/generationClient.ts for the parsing step.
  productionCost: string;
  timeRequired: string;
  location: string;
  specialStory?: string;
  imageFile?: File | null;
  imagePreviewUrl?: string | null;
}
