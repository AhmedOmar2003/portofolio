-- Add 3 image columns to services table
-- Run this in your Supabase SQL editor

ALTER TABLE public.services
  ADD COLUMN IF NOT EXISTS image_1_url TEXT,
  ADD COLUMN IF NOT EXISTS image_2_url TEXT,
  ADD COLUMN IF NOT EXISTS image_3_url TEXT;
