-- ============================================================
-- LEO OS: Migración v6 — Cierre de escritura pública (RLS)
-- Ejecutar en el SQL Editor de Supabase Dashboard
-- ============================================================
--
-- Hasta ahora todas las tablas tenían políticas RLS del tipo
-- "FOR ALL/INSERT/UPDATE/DELETE USING (true)", lo que significa que
-- cualquiera con la NEXT_PUBLIC_SUPABASE_ANON_KEY (que viaja en el
-- bundle del cliente y es pública) podía leer, modificar o borrar
-- tus emails, suscripciones, proyectos, agentes y logs directamente
-- contra la base de datos, sin pasar por la app.
--
-- Esta migración elimina las políticas de escritura/borrado públicas.
-- La lectura pública se mantiene (la app sigue funcionando igual desde
-- el navegador). Las escrituras ahora pasan por las rutas server-side
-- /api/db/[table], que usan la SUPABASE_SERVICE_ROLE_KEY — y las
-- consultas hechas con la service-role key omiten RLS por diseño en
-- Supabase, así que no se necesitan políticas nuevas para ellas.

-- 1. projects
DROP POLICY IF EXISTS "Public Write Access for Projects" ON projects;

-- 2. emails
DROP POLICY IF EXISTS "Public Write Access for Emails" ON emails;

-- 3. social_profiles
DROP POLICY IF EXISTS "Public Write Access for Social Profiles" ON social_profiles;

-- 4. subscriptions
DROP POLICY IF EXISTS "Public Write Access for Subscriptions" ON subscriptions;

-- 5. agent_logs
DROP POLICY IF EXISTS "Permitir inserción pública a agent_logs" ON agent_logs;
DROP POLICY IF EXISTS "Permitir eliminación pública a agent_logs" ON agent_logs;

-- 6. notifications
DROP POLICY IF EXISTS "Public Write Access for Notifications" ON notifications;
DROP POLICY IF EXISTS "Public Delete Access for Notifications" ON notifications;
DROP POLICY IF EXISTS "Public Update Access for Notifications" ON notifications;

-- 7. project_tasks
DROP POLICY IF EXISTS "Allow public insert to project_tasks" ON public.project_tasks;
DROP POLICY IF EXISTS "Allow public update to project_tasks" ON public.project_tasks;
DROP POLICY IF EXISTS "Allow public delete to project_tasks" ON public.project_tasks;

-- 8. agents
DROP POLICY IF EXISTS "Allow public insert access on agents" ON public.agents;
DROP POLICY IF EXISTS "Allow public update access on agents" ON public.agents;
DROP POLICY IF EXISTS "Allow public delete access on agents" ON public.agents;

-- Tras esta migración, cada tabla solo conserva su política de
-- lectura pública (SELECT). Cualquier INSERT/UPDATE/DELETE intentado
-- con la anon key será rechazado por Postgres (denegación por defecto
-- bajo RLS sin política coincidente).
