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
  productionCost: string;
  timeRequired: string;
  location: string;
  specialStory?: string;
  imageFile?: File | null;
  imagePreviewUrl?: string | null;
}
