import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

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
