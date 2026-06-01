-- ============================================================
-- LEO OS: Tabla de Telemetría Real-Time de Agent Logs
-- Ejecutar en el SQL Editor de Supabase Dashboard
-- ============================================================

-- 1. Crear la Tabla de Logs del Agente
CREATE TABLE IF NOT EXISTS agent_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    level TEXT NOT NULL CHECK (level IN ('INFO', 'ERROR', 'SUCCESS', 'WARNING')),
    component TEXT NOT NULL,
    message TEXT NOT NULL
);

-- 2. Habilitar RLS (Seguridad a nivel de filas)
ALTER TABLE agent_logs ENABLE ROW LEVEL SECURITY;

-- 3. Crear Políticas de Seguridad RLS
-- Permitir lectura a cualquier persona o cliente autenticado (o público)
CREATE POLICY "Permitir lectura pública a agent_logs" ON agent_logs
    FOR SELECT USING (true);

-- Permitir inserción desde el agente autónomo con claves anónimas/servicios
CREATE POLICY "Permitir inserción pública a agent_logs" ON agent_logs
    FOR INSERT WITH CHECK (true);

-- Permitir eliminación (Clear Logs) desde el Dashboard de forma pública
CREATE POLICY "Permitir eliminación pública a agent_logs" ON agent_logs
    FOR DELETE USING (true);

-- 4. Semilla de datos de prueba iniciales (Seed Data)
INSERT INTO agent_logs (level, component, message)
VALUES 
    ('INFO', 'Brain', 'Ecosistema de telemetría de logs iniciado de forma exitosa.'),
    ('SUCCESS', 'Brain', 'OmniAgent conectado con éxito a la base de datos de Supabase.'),
    ('INFO', 'shell_ops', 'Escaneando archivos en el directorio de trabajo local...');
