-- LEO OS Migration v3: Command Center Updates
-- Execute this script in your Supabase SQL editor to add the new columns.

-- 1. Add repo_url and live_url to projects
ALTER TABLE projects ADD COLUMN IF NOT EXISTS repo_url TEXT DEFAULT NULL;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS live_url TEXT DEFAULT NULL;

-- 2. Add renewal_date to subscriptions
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS renewal_date DATE DEFAULT NULL;
