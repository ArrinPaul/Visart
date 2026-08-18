import type { ProductInputData, VisartGeneration } from './visart';

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      artisans: {
        Row: {
          id: string;
          name: string;
          location: string | null;
          craft: string | null;
          preferred_language: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          location?: string | null;
          craft?: string | null;
          preferred_language?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          location?: string | null;
          craft?: string | null;
          preferred_language?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      products: {
        Row: {
          id: string;
          artisan_id: string | null;
          image_url: string | null;
          input_data: ProductInputData;
          generated_data: VisartGeneration | null;
          is_published: boolean | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          artisan_id?: string | null;
          image_url?: string | null;
          input_data: ProductInputData;
          generated_data?: VisartGeneration | null;
          is_published?: boolean | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          artisan_id?: string | null;
          image_url?: string | null;
          input_data?: ProductInputData;
          generated_data?: VisartGeneration | null;
          is_published?: boolean | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'products_artisan_id_fkey';
            columns: ['artisan_id'];
            isOneToOne: false;
            referencedRelation: 'artisans';
            referencedColumns: ['id'];
          }
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type ArtisanRow = Database['public']['Tables']['artisans']['Row'];
export type ArtisanInsert = Database['public']['Tables']['artisans']['Insert'];
export type ArtisanUpdate = Database['public']['Tables']['artisans']['Update'];
export type ProductRow = Database['public']['Tables']['products']['Row'];
export type ProductInsert = Database['public']['Tables']['products']['Insert'];
export type ProductUpdate = Database['public']['Tables']['products']['Update'];
