-- LEO OS: Supabase Database Schema & Seed Data
-- Run this script in the Supabase SQL Editor to set up your tables.

-- Drop existing tables if they exist (clean setup)
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS emails;
DROP TABLE IF EXISTS social_profiles;
DROP TABLE IF EXISTS subscriptions;

-- 1. Projects Table
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    status TEXT NOT NULL,
    progress INTEGER NOT NULL CHECK (progress >= 0 AND progress <= 100),
    tech_stack TEXT[] NOT NULL DEFAULT '{}',
    description TEXT DEFAULT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS and add public access policies for development
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Access for Projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Public Write Access for Projects" ON projects FOR ALL USING (true);

-- Seed Projects
INSERT INTO projects (name, status, progress, tech_stack, description) VALUES
('mmnexus-hub', '🟢 Full Green', 95, ARRAY['Next.js', 'React', 'Tailwind CSS', 'Vercel', 'Supabase'], 'Hub central del ecosistema M&M Nexus.'),
('OmniAgent v7.0', '🟡 Conectando LLM', 85, ARRAY['Python', 'LangChain', 'FastAPI', 'OpenAI', 'GPT-4'], 'Agente autónomo de IA con capacidad multi-modelo.'),
('CoreOps', '🟣 En Producción', 90, ARRAY['Go', 'Docker', 'Kubernetes', 'gRPC', 'Terraform'], 'Infraestructura core de operaciones.'),
('MoneyFlow Pro', '🟢 MVP Funcional', 80, ARRAY['TypeScript', 'React', 'Supabase', 'Stripe', 'Recharts'], 'Plataforma de gestión financiera personal.'),
('Fabrica de Productos', '🟢 Motor Activo', 35, ARRAY['React', 'Node.js', 'Supabase', 'Stripe'], 'Sistema de productos digitales escalables.'),
('Digital Business', '🔵 Estrategia', 40, ARRAY['Next.js', 'Tailwind CSS', 'Supabase', 'Analytics'], 'Ecosistema de negocios digitales.');


-- 2. Emails Table
CREATE TABLE emails (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    label TEXT NOT NULL CHECK (label IN ('Personal', 'Work', 'Development', 'Archive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS and add public access policies for development
ALTER TABLE emails ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Access for Emails" ON emails FOR SELECT USING (true);
CREATE POLICY "Public Write Access for Emails" ON emails FOR ALL USING (true);

-- Seed Emails
INSERT INTO emails (email, label) VALUES
('leomacaris1@gmail.com', 'Personal'),
('leo.macaris.work@outlook.com', 'Work'),
('dev.leomacaris@gmail.com', 'Development');


-- 3. Social Profiles Table
CREATE TABLE social_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    platform TEXT NOT NULL CHECK (platform IN ('GitHub', 'LinkedIn', 'Twitter/X', 'YouTube', 'Portfolio')),
    username TEXT NOT NULL,
    url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS and add public access policies for development
ALTER TABLE social_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Access for Social Profiles" ON social_profiles FOR SELECT USING (true);
CREATE POLICY "Public Write Access for Social Profiles" ON social_profiles FOR ALL USING (true);

-- Seed Social Profiles
INSERT INTO social_profiles (platform, username, url) VALUES
('GitHub', 'leomacaris', 'https://github.com/leomacaris'),
('LinkedIn', 'Leo Macaris', 'https://linkedin.com/in/leomacaris'),
('Twitter/X', '@leomacaris', 'https://x.com/leomacaris');


-- 4. Subscriptions Table
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    cost NUMERIC(10, 2) NOT NULL CHECK (cost >= 0),
    billing_cycle TEXT NOT NULL CHECK (billing_cycle IN ('Monthly', 'Annually')),
    status TEXT NOT NULL CHECK (status IN ('Active', 'Paused', 'Expired')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS and add public access policies for development
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Access for Subscriptions" ON subscriptions FOR SELECT USING (true);
CREATE POLICY "Public Write Access for Subscriptions" ON subscriptions FOR ALL USING (true);

-- Seed Subscriptions
INSERT INTO subscriptions (name, cost, billing_cycle, status) VALUES
('ChatGPT Plus', 20.00, 'Monthly', 'Active'),
('Netflix Premium', 15.49, 'Monthly', 'Active'),
('Spotify Family', 10.99, 'Monthly', 'Active'),
('GitHub Copilot', 10.00, 'Monthly', 'Active'),
('Vercel Pro', 20.00, 'Monthly', 'Active');
