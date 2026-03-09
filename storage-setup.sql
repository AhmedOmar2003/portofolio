-- --------------------------------------------------------
-- FIX: Create Storage Bucket and Policies
-- --------------------------------------------------------

-- 1. Create the storage bucket (if it doesn't exist)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('portfolio-media', 'portfolio-media', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Drop any existing policies on this bucket to prevent conflicts
DROP POLICY IF EXISTS "Allow public read access on media" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated insert on media" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated update on media" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated delete on media" ON storage.objects;

-- 3. Setup Security Policies for the bucket
-- Allow public read access to all objects in the bucket
CREATE POLICY "Allow public read access on media" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'portfolio-media');

-- Allow authenticated users (Admin) to upload new objects
CREATE POLICY "Allow authenticated insert on media" 
ON storage.objects FOR INSERT 
TO authenticated
WITH CHECK (bucket_id = 'portfolio-media');

-- Allow authenticated users to update objects
CREATE POLICY "Allow authenticated update on media" 
ON storage.objects FOR UPDATE 
TO authenticated
USING (bucket_id = 'portfolio-media');

-- Allow authenticated users to delete objects
CREATE POLICY "Allow authenticated delete on media" 
ON storage.objects FOR DELETE 
TO authenticated
USING (bucket_id = 'portfolio-media');
