-- Phase 4: Case Study Migration

-- Add new fields to the projects table to support Case Studies

ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS idea_en TEXT,
ADD COLUMN IF NOT EXISTS idea_ar TEXT,
ADD COLUMN IF NOT EXISTS ui_ux_en TEXT,
ADD COLUMN IF NOT EXISTS ui_ux_ar TEXT,
ADD COLUMN IF NOT EXISTS technologies JSONB DEFAULT '[]'::jsonb;

-- Note: We are keeping process_en and process_ar in case previous data exists,
-- but the UI will now use idea_en/ar and problem_en/ar primarily.
