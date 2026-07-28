-- Run this in your Supabase SQL Editor

-- 1. Create the applications table
CREATE TABLE applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL UNIQUE, -- 1 app per user
    full_name TEXT NOT NULL,
    srm_email TEXT NOT NULL,
    registration_number TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    domain_preference TEXT NOT NULL,
    github_url TEXT,
    linkedin_url TEXT,
    why_join TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- 3. Policy: Users can only select their own application
CREATE POLICY "Users can view own application" 
ON applications FOR SELECT 
USING (auth.uid() = user_id);

-- 4. Policy: Users can insert their own application
CREATE POLICY "Users can insert own application" 
ON applications FOR INSERT 
WITH CHECK (auth.uid() = user_id);
