-- Run this in your Supabase SQL Editor to apply the requested changes

-- 1. Add github_email column so it syncs easily to Google Sheets
ALTER TABLE applications ADD COLUMN github_email TEXT;

-- 2. Remove the rule that strictly limits to 1 application per user
ALTER TABLE applications DROP CONSTRAINT applications_user_id_key;

-- 3. Add a new rule: 1 application PER DOMAIN per user
ALTER TABLE applications ADD CONSTRAINT unique_user_domain UNIQUE(user_id, domain_preference);

-- 4. Allow users to UPDATE their own applications (so they can edit)
CREATE POLICY "Users can update own application" 
ON applications FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
