-- Migration v4: Project Tasks (Audit & Checklist)

-- 1. Create the project_tasks table
CREATE TABLE IF NOT EXISTS public.project_tasks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    is_completed BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Add Row Level Security (RLS) policies
ALTER TABLE public.project_tasks ENABLE ROW LEVEL SECURITY;

-- Allow all operations for now (can be restricted later)
CREATE POLICY "Allow public read access to project_tasks" 
    ON public.project_tasks FOR SELECT 
    USING (true);

CREATE POLICY "Allow public insert to project_tasks" 
    ON public.project_tasks FOR INSERT 
    WITH CHECK (true);

CREATE POLICY "Allow public update to project_tasks" 
    ON public.project_tasks FOR UPDATE 
    USING (true);

CREATE POLICY "Allow public delete to project_tasks" 
    ON public.project_tasks FOR DELETE 
    USING (true);

-- 3. Trigger to calculate project progress automatically
-- When a task is inserted, updated, or deleted, recalculate the project's progress.

CREATE OR REPLACE FUNCTION update_project_progress()
RETURNS TRIGGER AS $$
DECLARE
    total_tasks INT;
    completed_tasks INT;
    new_progress INT;
    pid UUID;
BEGIN
    -- Determine the project_id depending on the operation
    IF (TG_OP = 'DELETE') THEN
        pid := OLD.project_id;
    ELSE
        pid := NEW.project_id;
    END IF;

    -- Calculate total and completed tasks
    SELECT COUNT(*) INTO total_tasks FROM public.project_tasks WHERE project_id = pid;
    SELECT COUNT(*) INTO completed_tasks FROM public.project_tasks WHERE project_id = pid AND is_completed = true;

    -- Calculate progress percentage
    IF total_tasks = 0 THEN
        new_progress := 0;
    ELSE
        new_progress := (completed_tasks * 100) / total_tasks;
    END IF;

    -- Update the project
    UPDATE public.projects SET progress = new_progress WHERE id = pid;

    RETURN NULL; -- After trigger doesn't need to return a row
END;
$$ LANGUAGE plpgsql;

-- Create the triggers
DROP TRIGGER IF EXISTS trg_update_project_progress_insert_update ON public.project_tasks;
CREATE TRIGGER trg_update_project_progress_insert_update
AFTER INSERT OR UPDATE OF is_completed ON public.project_tasks
FOR EACH ROW
EXECUTE FUNCTION update_project_progress();

DROP TRIGGER IF EXISTS trg_update_project_progress_delete ON public.project_tasks;
CREATE TRIGGER trg_update_project_progress_delete
AFTER DELETE ON public.project_tasks
FOR EACH ROW
EXECUTE FUNCTION update_project_progress();

-- 4. Enable Realtime for project_tasks
BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime;
COMMIT;
ALTER PUBLICATION supabase_realtime ADD TABLE public.project_tasks;
