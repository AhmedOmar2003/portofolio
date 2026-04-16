-- Add whatsapp_number column to site_settings table
-- Run this in your Supabase SQL Editor

ALTER TABLE public.site_settings
  ADD COLUMN IF NOT EXISTS whatsapp_number TEXT,
  ADD COLUMN IF NOT EXISTS contact_email TEXT;
