import React, { useState, useEffect } from 'react';
import { Project, ProjectTask, dbService } from '../lib/supabase';
import { X, CheckCircle2, Circle, Plus, Trash2, LayoutList } from 'lucide-react';

interface ProjectAuditModalProps {
  project: Project;
  onClose: () => void;
}

export default function ProjectAuditModal({ project, onClose }: ProjectAuditModalProps) {
  const [tasks, setTasks] = useState<ProjectTask[]>([]);
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [loading, setLoading] = useState(true);

  const loadTasks = React.useCallback(async () => {
    setLoading(true);
    const data = await dbService.getProjectTasks(project.id);
    setTasks(data);
    setLoading(false);
  }, [project.id]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskDesc.trim()) return;
    
    const newTask = await dbService.createProjectTask({
      project_id: project.id,
      description: newTaskDesc,
      is_completed: false
    });
    
    if (newTask) {
      setTasks([...tasks, newTask]);
      setNewTaskDesc('');
    }
  };

  const toggleTask = async (task: ProjectTask) => {
    // Optimistic UI update
    setTasks(prev => prev.map(t => t.id === task.id ? { ...t, is_completed: !(t.is_completed || t.status === 'completed'), status: (t.is_completed || t.status === 'completed') ? 'pending' : 'completed' } : t));
    
    await dbService.updateProjectTask(task.id, {
      is_completed: !(task.is_completed || task.status === 'completed'),
      status: (task.is_completed || task.status === 'completed') ? 'pending' : 'completed'
    });
  };

  const deleteTask = async (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    await dbService.deleteProjectTask(id);
  };

  const completedCount = tasks.filter(t => t.is_completed || t.status === 'completed').length;
  const progressPercent = tasks.length === 0 ? 0 : Math.round((completedCount / tasks.length) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-[#0a0e1a] border border-cyan-500/30 rounded-2xl w-full max-w-2xl flex flex-col max-h-[85vh] shadow-[0_0_50px_rgba(6,182,212,0.15)] relative overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-900 bg-slate-900/40 relative">
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 text-slate-500 hover:text-rose-400 transition-colors"
            title="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3 mb-2">
            <LayoutList className="w-6 h-6 text-cyan-400" />
            <h3 className="text-xl font-bold text-slate-200">Auditoría de Proyecto</h3>
          </div>
          <p className="text-sm text-slate-400">
            Gestionando tareas para: <span className="text-cyan-400 font-semibold">{project.name}</span>
          </p>
          
          {/* Progress Bar inside Audit */}
          <div className="mt-6 flex items-center gap-4">
            <div className="flex-1 h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
              <style>{`
                .audit-progress-bar {
                  width: ${progressPercent}%;
                }
              `}</style>
              <div className="h-full bg-gradient-to-r from-cyan-500 to-teal-400 transition-all duration-500 audit-progress-bar"></div>
            </div>
            <div className="text-2xl font-mono font-bold text-slate-200">
              {progressPercent}%
            </div>
          </div>
        </div>

        {/* Tasks List */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-950/20">
          {loading ? (
            <div className="text-center py-8 text-slate-500 animate-pulse text-sm">Cargando tareas...</div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-10 text-slate-600 text-sm">
              No hay tareas de auditoría definidas. Agrega una para comenzar a calcular el progreso.
            </div>
          ) : (
            <ul className="space-y-3">
              {tasks.map(task => (
                <li key={task.id} className="flex items-center gap-3 bg-slate-900/50 p-3 rounded-xl border border-slate-800/50 hover:border-cyan-500/20 transition-colors group">
                  <button 
                    onClick={() => toggleTask(task)}
                    className="flex-shrink-0 focus:outline-none"
                    title={(task.is_completed || task.status === 'completed') ? "Marcar como pendiente" : "Marcar como completada"}
                  >
                    {(task.is_completed || task.status === 'completed') ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                    ) : (
                      <Circle className="w-6 h-6 text-slate-600 hover:text-cyan-400 transition-colors" />
                    )}
                  </button>
                  <span className={`flex-1 text-sm ${(task.is_completed || task.status === 'completed') ? 'text-slate-500 line-through' : 'text-slate-300'}`}>
                    {task.description}
                  </span>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="text-slate-600 hover:text-rose-400 p-1.5 opacity-0 group-hover:opacity-100 transition-all focus:outline-none"
                    title="Eliminar tarea"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Add Task Input */}
        <div className="p-6 border-t border-slate-900 bg-slate-900/40">
          <form onSubmit={handleAddTask} className="flex gap-3">
            <input
              type="text"
              value={newTaskDesc}
              onChange={(e) => setNewTaskDesc(e.target.value)}
              placeholder="Nueva tarea (Ej: Configurar Auth en Supabase)"
              className="flex-1 bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:border-cyan-500/50 text-sm"
            />
            <button
              type="submit"
              disabled={!newTaskDesc.trim()}
              className="bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-bold px-4 py-2.5 rounded-xl transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" />
              Añadir
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
