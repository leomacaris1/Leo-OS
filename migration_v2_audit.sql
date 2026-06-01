-- ============================================================
-- LEO OS: Migración v2 – Auditoría Real de Proyectos
-- Ejecutar en el SQL Editor de Supabase Dashboard
-- ============================================================

-- ─── PASO 1: Agregar columna 'description' (si no existe) ───
-- El esquema original NO tenía columna description/summary/notes.
-- La agregamos como TEXT opcional.
ALTER TABLE projects ADD COLUMN IF NOT EXISTS description TEXT DEFAULT NULL;

-- ─── PASO 2: Eliminar CHECK constraint de 'status' ───
-- Esto permite usar textos libres con emojis como '🟢 Full Green'
-- El nombre de la constraint generado por Postgres es 'projects_status_check'
ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_status_check;

-- ─── PASO 3: Actualizar proyectos existentes con datos de auditoría ───

-- mmnexus-hub (o Leo Portfolio si ya fue renombrado)
UPDATE projects 
SET 
  name = 'mmnexus-hub',
  progress = 95, 
  status = '🟢 Full Green',
  description = 'Hub central del ecosistema M&M Nexus. Portal web con dashboard administrativo.',
  tech_stack = ARRAY['Next.js', 'React', 'Tailwind CSS', 'Vercel', 'Supabase']
WHERE name IN ('mmnexus-hub', 'Leo Portfolio');

-- OmniAgent → OmniAgent v7.0
UPDATE projects 
SET 
  name = 'OmniAgent v7.0',
  progress = 85, 
  status = '🟡 Conectando LLM',
  description = 'Agente autónomo de IA con capacidad multi-modelo y orquestación de tareas.',
  tech_stack = ARRAY['Python', 'LangChain', 'FastAPI', 'OpenAI', 'GPT-4']
WHERE name IN ('OmniAgent', 'OmniAgent v7.0');

-- MoneyFlow → MoneyFlow Pro
UPDATE projects 
SET 
  name = 'MoneyFlow Pro',
  progress = 80, 
  status = '🟢 MVP Funcional',
  description = 'Plataforma de gestión financiera personal con tracking de suscripciones e inversiones.',
  tech_stack = ARRAY['TypeScript', 'React', 'Supabase', 'Stripe', 'Recharts']
WHERE name IN ('MoneyFlow', 'MoneyFlow Pro');

-- CoreOps
UPDATE projects 
SET 
  progress = 90, 
  status = '🟣 En Producción',
  description = 'Infraestructura core de operaciones con CI/CD, contenedores y microservicios.',
  tech_stack = ARRAY['Go', 'Docker', 'Kubernetes', 'gRPC', 'Terraform']
WHERE name = 'CoreOps';

-- ─── PASO 4: Insertar nuevos proyectos ───

-- Fabrica de Productos (solo inserta si no existe)
INSERT INTO projects (name, status, progress, tech_stack, description)
SELECT 
  'Fabrica de Productos', 
  '🟢 Motor Activo', 
  35, 
  ARRAY['React', 'Node.js', 'Supabase', 'Stripe'],
  'Sistema de creación y distribución de productos digitales escalables.'
WHERE NOT EXISTS (
  SELECT 1 FROM projects WHERE name = 'Fabrica de Productos'
);

-- Digital Business (solo inserta si no existe)
INSERT INTO projects (name, status, progress, tech_stack, description)
SELECT 
  'Digital Business', 
  '🔵 Estrategia', 
  40, 
  ARRAY['Next.js', 'Tailwind CSS', 'Supabase', 'Analytics'],
  'Ecosistema de negocios digitales con automatización de marketing y ventas.'
WHERE NOT EXISTS (
  SELECT 1 FROM projects WHERE name = 'Digital Business'
);

-- ─── PASO 5: Verificar resultados ───
SELECT id, name, status, progress, description, tech_stack FROM projects ORDER BY progress DESC;
