-- Articles table: add missing columns that the frontend uses
-- Run this in the Supabase SQL Editor ONLY IF these columns don't exist yet.

ALTER TABLE articles
  ADD COLUMN IF NOT EXISTS category TEXT,
  ADD COLUMN IF NOT EXISTS read_time_minutes INTEGER DEFAULT 5,
  ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT false;

-- Allow authenticated users (admin) to read all articles
DROP POLICY IF EXISTS "Authenticated users can read all articles" ON articles;
CREATE POLICY "Authenticated users can read all articles"
  ON articles FOR SELECT TO authenticated USING (true);

-- Allow public (anon) to also read all articles on the public site
DROP POLICY IF EXISTS "Anyone can read published articles" ON articles;
CREATE POLICY "Anyone can read published articles"
  ON articles FOR SELECT TO anon USING (true);
