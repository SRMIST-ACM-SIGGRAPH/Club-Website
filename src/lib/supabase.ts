import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Project = {
  id: string;
  title: string;
  description: string;
  tech_stack: string[];
  image_url: string; // Legacy fallback
  image_urls?: string[]; // New array of images
  github_url: string | null;
  demo_url: string | null;
  created_at: string;
};

export type EventRecord = {
  id: string;
  title: string;
  description: string;
  date: string;
  poster_url: string;
  created_at: string;
};
