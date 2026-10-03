-- ============================================================
-- BILINGUAL CONTENT — adds English translation columns
--
-- WHY: The admin needs to provide content in both French and English
--      since the site supports both languages. French remains the
--      primary language; English columns are nullable fallbacks.
--
-- HOW: Supabase -> SQL Editor -> New query -> paste -> Run
--      Safe to run more than once (uses IF NOT EXISTS / exception blocks).
-- ============================================================

-- ---------- works ----------
DO $$ BEGIN
  ALTER TABLE public.works ADD COLUMN title_en text;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public.works ADD COLUMN description_en text;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

-- ---------- faqs ----------
DO $$ BEGIN
  ALTER TABLE public.faqs ADD COLUMN question_en text;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public.faqs ADD COLUMN answer_en text;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

-- ---------- posts ----------
DO $$ BEGIN
  ALTER TABLE public.posts ADD COLUMN title_en text;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public.posts ADD COLUMN slug_en text;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public.posts ADD COLUMN excerpt_en text;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public.posts ADD COLUMN content_en text;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

-- Unique index on slug_en so no two posts share the same English URL.
CREATE UNIQUE INDEX IF NOT EXISTS posts_slug_en_unique
  ON public.posts (slug_en) WHERE slug_en IS NOT NULL;
