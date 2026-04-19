-- Add service type column for filtering service cards by type
-- Run this once in Supabase SQL editor

ALTER TABLE public.services
  ADD COLUMN IF NOT EXISTS service_type TEXT DEFAULT 'full_design_development';

UPDATE public.services
SET service_type = 'full_design_development'
WHERE service_type IS NULL OR btrim(service_type) = '';
