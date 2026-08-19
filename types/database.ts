import type { ProductInputData, VisartGeneration, ProductRecord } from './visart';
import type { ProductFormData } from './frontend';

export type { ProductRecord };

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
          input_data: ProductInputData | ProductFormData;
          generated_data: VisartGeneration | null;
          is_published: boolean | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          artisan_id?: string | null;
          image_url?: string | null;
          input_data?: ProductInputData | ProductFormData;
          generated_data?: VisartGeneration | null;
          is_published?: boolean | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          artisan_id?: string | null;
          image_url?: string | null;
          input_data?: ProductInputData | ProductFormData;
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
      product_feedback: {
        Row: {
          id: string;
          product_id: string;
          user_name: string;
          user_location: string | null;
          is_verified_buyer: boolean | null;
          rating: number;
          authenticity_rating: string;
          comment: string;
          craft_checks: Json | null;
          suspected_counterfeit_reason: string | null;
          flagged_as_fake: boolean | null;
          helpful_count: number | null;
          gemini_analysis: Json | null;
          created_at: string;
        };
        Insert: {
          id: string;
          product_id: string;
          user_name: string;
          user_location?: string | null;
          is_verified_buyer?: boolean | null;
          rating: number;
          authenticity_rating: string;
          comment: string;
          craft_checks?: Json | null;
          suspected_counterfeit_reason?: string | null;
          flagged_as_fake?: boolean | null;
          helpful_count?: number | null;
          gemini_analysis?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          user_name?: string;
          user_location?: string | null;
          is_verified_buyer?: boolean | null;
          rating?: number;
          authenticity_rating?: string;
          comment?: string;
          craft_checks?: Json | null;
          suspected_counterfeit_reason?: string | null;
          flagged_as_fake?: boolean | null;
          helpful_count?: number | null;
          gemini_analysis?: Json | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'product_feedback_product_id_fkey';
            columns: ['product_id'];
            isOneToOne: false;
            referencedRelation: 'products';
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
export type ProductFeedbackRow = Database['public']['Tables']['product_feedback']['Row'];
export type ProductFeedbackInsert = Database['public']['Tables']['product_feedback']['Insert'];
export type ProductFeedbackUpdate = Database['public']['Tables']['product_feedback']['Update'];
