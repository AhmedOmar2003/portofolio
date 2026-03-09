-- ============================================================
-- Fix RLS policies for authenticated admin CRUD operations
-- Run this in your Supabase SQL Editor
-- ============================================================

-- PROJECTS
CREATE POLICY "Authenticated users can insert projects"
  ON projects FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update projects"
  ON projects FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete projects"
  ON projects FOR DELETE TO authenticated USING (true);

-- SERVICES
CREATE POLICY "Authenticated users can insert services"
  ON services FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update services"
  ON services FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete services"
  ON services FOR DELETE TO authenticated USING (true);

-- ARTICLES
CREATE POLICY "Authenticated users can insert articles"
  ON articles FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update articles"
  ON articles FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete articles"
  ON articles FOR DELETE TO authenticated USING (true);

-- ABOUT
CREATE POLICY "Authenticated users can insert about"
  ON about FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update about"
  ON about FOR UPDATE TO authenticated USING (true);

-- CONTACT METHODS
CREATE POLICY "Authenticated users can insert contact_methods"
  ON contact_methods FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update contact_methods"
  ON contact_methods FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete contact_methods"
  ON contact_methods FOR DELETE TO authenticated USING (true);

-- SITE SETTINGS
CREATE POLICY "Authenticated users can insert site_settings"
  ON site_settings FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update site_settings"
  ON site_settings FOR UPDATE TO authenticated USING (true);
