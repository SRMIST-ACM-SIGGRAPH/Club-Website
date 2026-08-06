-- SQL Script to create the temporary applications table for the expo

CREATE TABLE temp_applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    full_name TEXT NOT NULL,
    srm_email TEXT NOT NULL,
    registration_number TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    github_url TEXT,
    linkedin_url TEXT,
    domain_preference TEXT NOT NULL,
    why_join TEXT,
    domain_answers JSONB,
    
    -- Ensuring that the same email cannot apply for the same domain multiple times
    CONSTRAINT unique_email_domain UNIQUE (srm_email, domain_preference)
);

-- Note: 
-- 1. `user_id` and `github_email` are omitted because GitHub authentication is temporarily disabled.
-- 2. `why_join` is kept as a TEXT column (but optional) since it's disabled in the frontend.
-- 3. The unique constraint prevents spam applications for the same domain by the same user.

-- --------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- --------------------------------------------------------

-- Enable Row Level Security on the table
ALTER TABLE temp_applications ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (since GitHub auth is disabled, the app uses the anon key)
CREATE POLICY "Allow anonymous inserts" ON temp_applications
    FOR INSERT 
    TO public
    WITH CHECK (true);

-- Allow anonymous updates (if a user tries to edit an application that was saved locally)
CREATE POLICY "Allow anonymous updates" ON temp_applications
    FOR UPDATE 
    TO public
    USING (true)
    WITH CHECK (true);

