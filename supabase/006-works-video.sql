-- ============================================================
-- Youssef Production — MIGRATION: ADD VIDEO_URL TO WORKS
--
-- Run this in your Supabase Dashboard -> SQL Editor -> New Query -> Run
-- ============================================================

-- 1. Add video_url column to public.works table
ALTER TABLE public.works ADD COLUMN IF NOT EXISTS video_url text;

-- 2. Update existing Caftan works to the new primary category 'Caftan & Tradition'
UPDATE public.works
SET category = 'Caftan & Tradition'
WHERE title ILIKE '%caftan%' OR title ILIKE '%caftane%';

-- 3. Confirm column and categories
SELECT id, title, category, video_url FROM public.works;
