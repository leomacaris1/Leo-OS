-- LEO OS: Notifications Schema
-- Ejecutar en el SQL Editor de Supabase Dashboard

CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('info', 'success', 'warning', 'error')),
    read BOOLEAN NOT NULL DEFAULT FALSE,
    source TEXT DEFAULT 'system',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Access for Notifications" ON notifications FOR SELECT USING (true);
CREATE POLICY "Public Write Access for Notifications" ON notifications FOR ALL USING (true);
CREATE POLICY "Public Delete Access for Notifications" ON notifications FOR DELETE USING (true);
CREATE POLICY "Public Update Access for Notifications" ON notifications FOR UPDATE USING (true);
