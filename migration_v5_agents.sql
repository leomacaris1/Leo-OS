-- Migration v5: Agents Table
-- Creates the base table for the Agent Builder

CREATE TABLE IF NOT EXISTS public.agents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    system_prompt TEXT NOT NULL,
    model TEXT NOT NULL DEFAULT 'gpt-4o',
    status TEXT NOT NULL DEFAULT 'offline',
    skills TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;

-- Allow public read access (for local dev / demo)
CREATE POLICY "Allow public read access on agents"
    ON public.agents FOR SELECT
    USING (true);

-- Allow public insert access
CREATE POLICY "Allow public insert access on agents"
    ON public.agents FOR INSERT
    WITH CHECK (true);

-- Allow public update access
CREATE POLICY "Allow public update access on agents"
    ON public.agents FOR UPDATE
    USING (true);

-- Allow public delete access
CREATE POLICY "Allow public delete access on agents"
    ON public.agents FOR DELETE
    USING (true);

-- Insert a default agent
INSERT INTO public.agents (name, role, system_prompt, model, status, skills)
VALUES 
    ('OmniPlanner', 'Orquestador Global', 'Eres el orquestador principal del sistema Leo OS. Tu trabajo es desglosar los objetivos del usuario en tareas.', 'claude-3-5-sonnet-20240620', 'online', ARRAY['planning', 'github_search'])
ON CONFLICT DO NOTHING;
