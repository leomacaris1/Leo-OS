'use client';

import React, { useState, useEffect } from 'react';
import { Project, ProjectTask, dbService } from '../lib/supabase';
import { 
  X, CheckCircle2, Circle, Plus, Trash2, Github, ExternalLink, 
  Edit3, Save, Sliders, CheckSquare, Layers 
} from 'lucide-react';
import { toast } from 'sonner';

interface ProjectDetailsDrawerProps {
  project: Project;
  onClose: () => void;
  onUpdateProject: (id: string, updates: Partial<Project>) => Promise<void>;
}

export default function ProjectDetailsDrawer({ project, onClose, onUpdateProject }: ProjectDetailsDrawerProps) {
  const [tasks, setTasks] = useState<ProjectTask[]>([]);
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [loadingTasks, setLoadingTasks] = useState(true);
  
  // Edit mode states
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(project.name);
  const [editStatus, setEditStatus] = useState(project.status);
  const [editTags, setEditTags] = useState(project.tech_stack.join(', '));
  const [editRepoUrl, setEditRepoUrl] = useState(project.repo_url || '');
  const [editLiveUrl, setEditLiveUrl] = useState(project.live_url || '');
  const [editDescription, setEditDescription] = useState(project.description || '');

  const loadTasks = React.useCallback(async () => {
    setLoadingTasks(true);
    const data = await dbService.getProjectTasks(project.id);
    setTasks(data);
    setLoadingTasks(false);
  }, [project.id]);

  useEffect(() => {
    loadTasks();
    
    // Reset edit form values when project changes
    setEditName(project.name);
    setEditStatus(project.status);
    setEditTags(project.tech_stack.join(', '));
    setEditRepoUrl(project.repo_url || '');
    setEditLiveUrl(project.live_url || '');
    setEditDescription(project.description || '');
    setIsEditing(false);
  }, [project, loadTasks]);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskDesc.trim()) return;
    
    const newTask = await dbService.createProjectTask({
      project_id: project.id,
      description: newTaskDesc.trim(),
      is_completed: false
    });
    
    if (newTask) {
      setTasks(prev => [...prev, newTask]);
      setNewTaskDesc('');
      toast.success('Tarea añadida');
    }
  };

  const handleToggleTask = async (task: ProjectTask) => {
    const isCompleted = !(task.is_completed || task.status === 'completed');
    const newStatus = isCompleted ? 'completed' : 'pending';

    // Optimistic UI update
    setTasks(prev => prev.map(t => t.id === task.id ? { ...t, is_completed: isCompleted, status: newStatus } : t));
    
    await dbService.updateProjectTask(task.id, {
      is_completed: isCompleted,
      status: newStatus
    });
  };

  const handleDeleteTask = async (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    await dbService.deleteProjectTask(id);
    toast.success('Tarea eliminada');
  };

  const handleSaveChanges = async () => {
    const parsedTags = editTags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    await onUpdateProject(project.id, {
      name: editName,
      status: editStatus,
      tech_stack: parsedTags,
      repo_url: editRepoUrl || undefined,
      live_url: editLiveUrl || undefined,
      description: editDescription || undefined
    });

    toast.success('Proyecto actualizado correctamente');
    setIsEditing(false);
  };

  const completedCount = tasks.filter(t => t.is_completed || t.status === 'completed').length;
  const progressPercent = tasks.length === 0 ? project.progress : Math.round((completedCount / tasks.length) * 100);

  const getStatusBadge = (status: string) => {
    if (status.startsWith('🟢')) return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400';
    if (status.startsWith('🟡')) return 'bg-amber-500/10 border-amber-500/30 text-amber-400';
    if (status.startsWith('🔵')) return 'bg-blue-500/10 border-blue-500/30 text-blue-400';
    return 'bg-purple-500/10 border-purple-500/30 text-purple-400';
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-xl bg-[#070b13] border-l border-slate-800 shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300">
      
      {/* Top Header */}
      <div className="p-6 border-b border-slate-900 bg-slate-950/40 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Layers className="w-5 h-5 text-cyan-400 glow-cyan" />
          <span className="text-xs font-mono font-bold tracking-widest text-slate-500 uppercase">Detalles del Núcleo</span>
        </div>
        <button 
          onClick={onClose}
          className="p-1.5 rounded-full hover:bg-slate-900 text-slate-400 hover:text-slate-200 transition-colors"
          title="Cerrar detalles"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        
        {/* Dynamic Edit / Info View */}
        {isEditing ? (
          <div className="space-y-4 bg-slate-900/20 p-5 rounded-2xl border border-slate-800/80">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-cyan-400" />
                Panel de Edición
              </h4>
              <button 
                onClick={() => setIsEditing(false)}
                className="text-xs text-rose-400 hover:underline"
              >
                Cancelar
              </button>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Nombre</label>
                <input 
                  type="text"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  title="Nombre del proyecto"
                  placeholder="Nombre del proyecto"
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500/50 text-sm"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Estado</label>
                <select 
                  value={editStatus}
                  onChange={e => setEditStatus(e.target.value)}
                  title="Estado del proyecto"
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500/50 text-sm"
                >
                  <option value="🟢 Full Green">🟢 Full Green</option>
                  <option value="🟢 MVP Funcional">🟢 MVP Funcional</option>
                  <option value="🟢 Motor Activo">🟢 Motor Activo</option>
                  <option value="🟡 Conectando LLM">🟡 Conectando LLM</option>
                  <option value="🟡 En Desarrollo">🟡 En Desarrollo</option>
                  <option value="🔵 Estrategia">🔵 Estrategia</option>
                  <option value="🟣 En Producción">🟣 En Producción</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Misión / Descripción</label>
                <textarea 
                  value={editDescription}
                  onChange={e => setEditDescription(e.target.value)}
                  title="Misión o descripción del proyecto"
                  placeholder="Misión o descripción del proyecto"
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500/50 text-sm min-h-[60px]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Stack Tecnológico</label>
                <input 
                  type="text"
                  value={editTags}
                  onChange={e => setEditTags(e.target.value)}
                  title="Stack Tecnológico"
                  placeholder="Stack Tecnológico"
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500/50 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">URL Repositorio</label>
                  <input 
                    type="url"
                    value={editRepoUrl}
                    onChange={e => setEditRepoUrl(e.target.value)}
                    title="URL del Repositorio"
                    placeholder="https://github.com/..."
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500/50 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">URL Live</label>
                  <input 
                    type="url"
                    value={editLiveUrl}
                    onChange={e => setEditLiveUrl(e.target.value)}
                    title="URL del sitio en vivo"
                    placeholder="https://vercel.app/..."
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500/50 text-sm"
                  />
                </div>
              </div>

              <button
                onClick={handleSaveChanges}
                title="Guardar cambios del proyecto"
                className="w-full mt-2 bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 font-bold p-2.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-[0_0_15px_rgba(6,182,212,0.3)]"
              >
                <Save className="w-4 h-4" />
                Guardar Cambios
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-2xl font-bold text-slate-100">{project.name}</h3>
                <span className="text-[10px] text-slate-500 font-mono mt-1 block">ID: {project.id}</span>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setIsEditing(true)}
                  className="p-2 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-100 rounded-xl transition-all"
                  title="Editar proyecto"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1.5 ${getStatusBadge(project.status)}`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                  {project.status}
                </span>
              </div>
            </div>

            {project.description && (
              <p className="text-sm text-slate-400 leading-relaxed bg-slate-950/30 p-4 rounded-xl border border-slate-900">
                {project.description}
              </p>
            )}

            {/* Quick Links */}
            <div className="flex gap-3">
              {project.repo_url && (
                <a 
                  href={project.repo_url} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 p-2.5 rounded-xl transition-all text-xs font-medium"
                >
                  <Github className="w-4 h-4" /> Repo Código
                </a>
              )}
              {project.live_url && (
                <a 
                  href={project.live_url} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 bg-teal-950/20 border border-teal-500/20 hover:border-teal-500/40 text-teal-400 p-2.5 rounded-xl transition-all text-xs font-medium"
                >
                  <ExternalLink className="w-4 h-4" /> Ver Online
                </a>
              )}
            </div>

            {/* Tech Stack */}
            <div className="flex flex-wrap gap-1.5">
              {project.tech_stack.map((tech, i) => (
                <span key={i} className="text-[10px] px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-900 text-slate-500 font-mono">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        <hr className="border-slate-900" />

        {/* Dynamic Project Tasks / Checklist */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <CheckSquare className="w-4 h-4 text-cyan-400" />
              Objetivos & Checklist ({completedCount}/{tasks.length})
            </h4>
            <span className="text-sm font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-lg border border-cyan-500/20">
              {progressPercent}%
            </span>
          </div>

          <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <style>{`
              .progress-bar-fill-drawer {
                width: ${progressPercent}%;
              }
            `}</style>
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 to-teal-400 transition-all duration-500 progress-bar-fill-drawer"
            />
          </div>

          {/* Add task inline */}
          <form onSubmit={handleAddTask} className="flex gap-2">
            <input
              type="text"
              value={newTaskDesc}
              onChange={e => setNewTaskDesc(e.target.value)}
              title="Añadir nuevo objetivo"
              placeholder="Añadir nuevo objetivo..."
              className="flex-1 bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500/30 text-sm placeholder-slate-600"
            />
            <button 
              type="submit"
              disabled={!newTaskDesc.trim()}
              title="Registrar objetivo"
              aria-label="Registrar objetivo"
              className="bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 px-3.5 rounded-xl text-xs font-bold transition-all disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
            </button>
          </form>

          {/* List of Tasks */}
          {loadingTasks ? (
            <div className="text-center py-6 text-xs text-slate-500 animate-pulse">Cargando objetivos del núcleo...</div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-600 italic">No hay objetivos definidos. Añade uno arriba.</div>
          ) : (
            <ul className="space-y-2">
              {tasks.map(task => {
                const isCompleted = task.is_completed || task.status === 'completed';
                return (
                  <li 
                    key={task.id} 
                    className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/30 border border-slate-900/60 hover:border-slate-800 transition-all group"
                  >
                    <button 
                      type="button"
                      onClick={() => handleToggleTask(task)}
                      className="text-slate-500 hover:text-cyan-400 transition-colors"
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>
                    <span className={`text-sm flex-1 ${isCompleted ? 'text-slate-500 line-through' : 'text-slate-300'}`}>
                      {task.description}
                    </span>
                    <button 
                      type="button"
                      onClick={() => handleDeleteTask(task.id)}
                      className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-rose-400 p-1 transition-all"
                      title="Eliminar objetivo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
