-- Run this to safely add missing columns to your projects table

ALTER TABLE public.projects 
  ADD COLUMN IF NOT EXISTS description TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS repo_url TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS live_url TEXT DEFAULT NULL;

-- Notify PostgREST to reload the schema cache
NOTIFY pgrst, 'reload schema';
