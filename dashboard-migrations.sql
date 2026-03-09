-- Phase 3: Dashboard Enhancements Migrations

-- 1. Contact Messages Table
-- Safely stores contact form submissions for the admin dashboard inbox
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (since the public contact form submits here)
DROP POLICY IF EXISTS "Anyone can insert contact messages" ON public.contact_messages;
CREATE POLICY "Anyone can insert contact messages" 
    ON public.contact_messages FOR INSERT 
    WITH CHECK (true);

-- Only authenticated admins can read/update/delete messages
DROP POLICY IF EXISTS "Admins can read/update/delete contact messages" ON public.contact_messages;
CREATE POLICY "Admins can read/update/delete contact messages" 
    ON public.contact_messages FOR ALL 
    USING (auth.role() = 'authenticated');


-- 2. Page Views Table
-- Lightweight custom analytics tracking
CREATE TABLE IF NOT EXISTS public.page_views (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    path TEXT NOT NULL,
    slug TEXT, -- Extracted slug for joining with projects/articles if applicable
    visitor_id TEXT NOT NULL, -- Hashed IP/UserAgent for privacy-friendly unique session tracking
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Note: We intentionally don't index visitor_id to maintain privacy as it's a daily hash, 
-- but we index path and slug for fast analytics querying.
CREATE INDEX IF NOT EXISTS idx_page_views_path ON public.page_views(path);
CREATE INDEX IF NOT EXISTS idx_page_views_slug ON public.page_views(slug);
CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON public.page_views(created_at);

-- Enable RLS
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

-- Allow anyone (public site visitors) to insert views
DROP POLICY IF EXISTS "Anyone can track views" ON public.page_views;
CREATE POLICY "Anyone can track views" 
    ON public.page_views FOR INSERT 
    WITH CHECK (true);

-- Only authenticated admins can read analytics data
DROP POLICY IF EXISTS "Admins can read views" ON public.page_views;
CREATE POLICY "Admins can read views" 
    ON public.page_views FOR SELECT 
    USING (auth.role() = 'authenticated');

-- Set up basic Supabase Realtime for the contact messages so the admin dashboard updates instantly
ALTER PUBLICATION supabase_realtime ADD TABLE public.contact_messages;
