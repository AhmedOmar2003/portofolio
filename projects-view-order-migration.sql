-- Add manual display order for projects (like services)
-- Run this once in Supabase SQL Editor.

ALTER TABLE public.projects
ADD COLUMN IF NOT EXISTS view_order INTEGER DEFAULT 0;

-- Backfill existing projects with a stable order based on created_at DESC
-- so current display order remains familiar before manual edits.
WITH ranked AS (
  SELECT id, (ROW_NUMBER() OVER (ORDER BY created_at DESC) - 1)::INTEGER AS order_index
  FROM public.projects
)
UPDATE public.projects p
SET view_order = ranked.order_index
FROM ranked
WHERE p.id = ranked.id
  AND (p.view_order IS NULL OR p.view_order = 0);

CREATE INDEX IF NOT EXISTS idx_projects_view_order
ON public.projects (view_order ASC, created_at DESC);
