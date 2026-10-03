-- ========================================================
-- SRMIST ACM SIGGRAPH - Events Table Schema Update
-- ========================================================
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/srjntvpfbiniqmokucmg/sql

-- 1. Add 'link' column to the events table
ALTER TABLE events 
ADD COLUMN IF NOT EXISTS link TEXT;

-- 2. Add documentation comment
COMMENT ON COLUMN events.link IS 'Optional external registration or event details link (e.g., Luma, Devfolio, Google Form, Unstop)';

-- ========================================================
-- Reference: Full 'events' Table Definition (if creating anew)
-- ========================================================
-- CREATE TABLE IF NOT EXISTS events (
--     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
--     title TEXT NOT NULL,
--     description TEXT NOT NULL,
--     date DATE NOT NULL,
--     poster_url TEXT NOT NULL,
--     link TEXT,
--     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
-- );
--
-- ALTER TABLE events ENABLE ROW LEVEL SECURITY;
--
-- CREATE POLICY "Public can view events" 
-- ON events FOR SELECT 
-- TO public 
-- USING (true);
