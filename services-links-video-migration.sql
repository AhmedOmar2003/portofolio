-- Add service link + video URL columns for services admin/dashboard
-- Run this in Supabase SQL editor once

ALTER TABLE public.services
  ADD COLUMN IF NOT EXISTS service_link_url TEXT,
  ADD COLUMN IF NOT EXISTS video_url TEXT;
