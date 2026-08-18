import { VisartGeneration } from "./visart";
import { ProductFormData } from "./frontend";

export interface ProductRecord {
  id: string;
  created_at?: string;
  updated_at?: string;
  input: ProductFormData;
  generation: VisartGeneration;
  image_url: string;
}

export type Database = {
  public: {
    Tables: {
      products: {
        Row: ProductRecord;
        Insert: Omit<ProductRecord, "created_at" | "updated_at"> & {
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<ProductRecord>;
      };
    };
  };
};
