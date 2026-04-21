import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export type Database = {
  public: {
    Tables: {
      comments: {
        Row: {
          id: string;
          page_id: string;
          page_type: string;
          author: string;
          email: string;
          content: string;
          created_at: string;
          avatar: string;
        };
        Insert: {
          id?: string;
          page_id: string;
          page_type: 'article' | 'product' | 'video' | 'tutorial';
          author: string;
          email: string;
          content: string;
          created_at?: string;
          avatar?: string;
        };
        Update: {
          id?: string;
          page_id?: string;
          page_type?: 'article' | 'product' | 'video' | 'tutorial';
          author?: string;
          email?: string;
          content?: string;
          created_at?: string;
          avatar?: string;
        };
      };
      products: {
        Row: {
          id: string;
          title: string;
          slug: string;
          image: string;
          description: string;
          tags: string[];
          protocols: string[];
          compatible: string[];
          video_code: string | null;
          buy_links: string[];
          pub_date: string;
          category: string;
          rating: number;
          price: number;
          pros: string[];
          cons: string[];
          verdict: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          image: string;
          description: string;
          tags?: string[];
          protocols?: string[];
          compatible?: string[];
          video_code?: string | null;
          buy_links?: string[];
          pub_date: string;
          category?: string;
          rating?: number;
          price?: number;
          pros?: string[];
          cons?: string[];
          verdict?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          image?: string;
          description?: string;
          tags?: string[];
          protocols?: string[];
          compatible?: string[];
          video_code?: string | null;
          buy_links?: string[];
          pub_date?: string;
          category?: string;
          rating?: number;
          price?: number;
          pros?: string[];
          cons?: string[];
          verdict?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      tutorials: {
        Row: {
          id: string;
          title: string;
          slug: string;
          description: string;
          content: string;
          pub_date: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          description: string;
          content: string;
          pub_date: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          description?: string;
          content?: string;
          pub_date?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};