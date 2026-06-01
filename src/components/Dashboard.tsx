'use client';

import React, { useState } from 'react';
import { 
  Project 
} from '../lib/supabase';
import { 
  Plus, 
  Edit3, 
  Layers, 
  Sliders,
  X,
  Sparkles
} from 'lucide-react';

interface DashboardProps {
  projects: Project[];
  onUpdateProject: (id: string, updates: Partial<Project>) => Promise<void>;
  onCreateProject: (project: Omit<Project, 'id'>) => Promise<void>;
}

export default function Dashboard({ projects, onUpdateProject, onCreateProject }: DashboardProps) {
  // Modal states
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isAddingProject, setIsAddingProject] = useState(false);

  // Form states for creating a new project
  const [newName, setNewName] = useState('');
  const [newStatus, setNewStatus] = useState<'Active' | 'In Progress' | 'Completed' | 'On Hold'>('In Progress');
  const [newProgress, setNewProgress] = useState(0);
  const [newTags, setNewTags] = useState('');

  // Form states for editing a project
  const [editName, setEditName] = useState('');
  const [editStatus, setEditStatus] = useState<'Active' | 'In Progress' | 'Completed' | 'On Hold'>('In Progress');
  const [editProgress, setEditProgress] = useState(0);
  const [editTags, setEditTags] = useState('');

  // Handle opening edit modal
  const openEditModal = (project: Project) => {
    setEditingProject(project);
    setEditName(project.name);
    setEditStatus(project.status);
    setEditProgress(project.progress);
    setEditTags(project.tech_stack.join(', '));
  };

  // Handle saving project edit
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    const parsedTags = editTags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    // If progress is 100%, automatically change status to Completed
    let finalStatus = editStatus;
    if (editProgress === 100) {
      finalStatus = 'Completed';
    } else if (editProgress < 100 && editStatus === 'Completed') {
      finalStatus = 'In Progress';
    }

    await onUpdateProject(editingProject.id, {
      name: editName,
      status: finalStatus,
      progress: editProgress,
      tech_stack: parsedTags
    });

    setEditingProject(null);
  };

  // Handle saving new project
  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const parsedTags = newTags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    let finalStatus = newStatus;
    if (newProgress === 100) {
      finalStatus = 'Completed';
    }

    await onCreateProject({
      name: newName,
      status: finalStatus,
      progress: newProgress,
      tech_stack: parsedTags.length > 0 ? parsedTags : ['React']
    });

    // Reset fields
    setNewName('');
    setNewStatus('In Progress');
    setNewProgress(0);
    setNewTags('');
    setIsAddingProject(false);
  };

  // Helper for status badge colors
  const getStatusStyle = (status: Project['status']) => {
    switch (status) {
      case 'Completed':
        return {
          bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
          dot: 'bg-emerald-400 shadow-[0_0_8px_#10b981]'
        };
      case 'In Progress':
        return {
          bg: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
          dot: 'bg-blue-400 shadow-[0_0_8px_#3b82f6]'
        };
      case 'Active':
        return {
          bg: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400',
          dot: 'bg-cyan-400 shadow-[0_0_8px_#06b6d4]'
        };
      case 'On Hold':
        return {
          bg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
          dot: 'bg-amber-400 shadow-[0_0_8px_#f59e0b]'
        };
      default:
        return {
          bg: 'bg-slate-500/10 border-slate-500/30 text-slate-400',
          dot: 'bg-slate-400'
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Area */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-100 flex items-center gap-2">
            <Layers className="w-8 h-8 text-cyan-400 glow-cyan animate-pulse" />
            Workspace de Proyectos
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Supervisión y control de proyectos activos en Leo OS.
          </p>
        </div>

        <button
          onClick={() => setIsAddingProject(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-slate-900 font-bold px-4 py-2.5 rounded-xl transition-all duration-300 shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] transform hover:scale-[1.02]"
        >
          <Plus className="w-5 h-5" />
          Nuevo Proyecto
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project) => {
          const statusStyle = getStatusStyle(project.status);
          return (
            <div key={project.id} className="glass-card rounded-2xl p-6 flex flex-col justify-between border relative overflow-hidden group">
              {/* Decorative top-border line glow */}
              <span className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent group-hover:via-cyan-400/50 transition-all duration-500"></span>

              <div>
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-200 tracking-wide group-hover:text-cyan-300 transition-colors duration-300">
                      {project.name}
                    </h3>
                    <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">ID: {project.id}</span>
                  </div>

                  <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${statusStyle.bg}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`}></span>
                    {project.status}
                  </span>
                </div>

                {/* Progress bar container */}
                <div className="mb-6 space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400">Progreso del Sistema</span>
                    <span className="text-cyan-400 font-bold glow-cyan">{project.progress}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-900/80 rounded-full overflow-hidden border border-slate-800/50 p-[1px]">
                    <div 
                      className={`h-full rounded-full progress-bar-fill bg-gradient-to-r ${
                        project.status === 'Completed' 
                          ? 'from-emerald-500 to-teal-400' 
                          : 'from-cyan-500 to-blue-500'
                      }`}
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Footer and Tags */}
              <div className="pt-4 border-t border-slate-900/60 flex justify-between items-end gap-4 mt-4">
                <div className="flex flex-wrap gap-1.5 max-w-[70%]">
                  {project.tech_stack.map((tech, i) => (
                    <span 
                      key={i} 
                      className="text-[10px] px-2 py-0.5 rounded bg-slate-950/70 border border-slate-850 text-slate-400 font-mono"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => openEditModal(project)}
                  className="flex items-center gap-1.5 text-xs text-cyan-400/85 hover:text-cyan-300 font-semibold bg-cyan-950/20 hover:bg-cyan-950/45 px-3 py-1.5 rounded-lg border border-cyan-500/20 hover:border-cyan-400/40 transition-all duration-300"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Editar
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* EDIT MODAL */}
      {editingProject && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-lg rounded-2xl border border-slate-800 p-6 shadow-2xl relative">
            <button 
              onClick={() => setEditingProject(null)}
              title="Cerrar modal"
              aria-label="Cerrar"
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-6">
              <Sliders className="w-6 h-6 text-cyan-400 glow-cyan" />
              <h3 className="text-xl font-bold text-slate-100">Editar Proyecto</h3>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label htmlFor="edit-name" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Nombre</label>
                <input 
                  type="text" 
                  id="edit-name"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Nombre del Proyecto"
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-2 text-slate-200 focus:outline-none focus:border-cyan-500/50"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="edit-status" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Estado</label>
                  <select 
                    id="edit-status"
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as Project['status'])}
                    title="Estado del Proyecto"
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-2 text-slate-200 focus:outline-none focus:border-cyan-500/50"
                  >
                    <option value="Active">Active</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="On Hold">On Hold</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="edit-progress" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Progreso: <span className="text-cyan-400 font-bold glow-cyan">{editProgress}%</span>
                  </label>
                  <div className="flex items-center gap-3 py-2">
                    <input 
                      type="range" 
                      id="edit-progress"
                      min="0" 
                      max="100" 
                      value={editProgress}
                      onChange={(e) => setEditProgress(Number(e.target.value))}
                      title="Progreso de Completado"
                      className="w-full accent-cyan-400 h-1.5 bg-slate-900 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Stack Tecnológico (separados por coma)
                </label>
                <input 
                  type="text" 
                  value={editTags}
                  onChange={(e) => setEditTags(e.target.value)}
                  placeholder="Next.js, Tailwind, Supabase"
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-2 text-slate-200 focus:outline-none focus:border-cyan-500/50"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-900">
                <button 
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-slate-200 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-900 font-bold px-5 py-2 rounded-xl transition-all duration-300 shadow-[0_0_15px_rgba(6,182,212,0.2)] hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD MODAL */}
      {isAddingProject && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-lg rounded-2xl border border-slate-800 p-6 shadow-2xl relative">
            <button 
              onClick={() => setIsAddingProject(false)}
              title="Cerrar modal"
              aria-label="Cerrar"
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-6 h-6 text-emerald-400" />
              <h3 className="text-xl font-bold text-slate-100">Crear Nuevo Proyecto</h3>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label htmlFor="new-name" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Nombre</label>
                <input 
                  type="text" 
                  id="new-name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="ej: OmniAgent"
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-2 text-slate-200 focus:outline-none focus:border-cyan-500/50"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="new-status" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Estado</label>
                  <select 
                    id="new-status"
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as Project['status'])}
                    title="Estado del Proyecto"
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-2 text-slate-200 focus:outline-none focus:border-cyan-500/50"
                  >
                    <option value="Active">Active</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="On Hold">On Hold</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="new-progress" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Progreso: <span className="text-emerald-400 font-bold">{newProgress}%</span>
                  </label>
                  <div className="flex items-center gap-3 py-2">
                    <input 
                      type="range" 
                      id="new-progress"
                      min="0" 
                      max="100" 
                      value={newProgress}
                      onChange={(e) => setNewProgress(Number(e.target.value))}
                      title="Progreso de Completado"
                      className="w-full accent-emerald-400 h-1.5 bg-slate-900 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Stack Tecnológico (separados por coma)
                </label>
                <input 
                  type="text" 
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder="Next.js, Python, OpenAI"
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-2 text-slate-200 focus:outline-none focus:border-cyan-500/50"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-900">
                <button 
                  type="button"
                  onClick={() => setIsAddingProject(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-slate-200 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-900 font-bold px-5 py-2 rounded-xl transition-all duration-300 shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]"
                >
                  Registrar Proyecto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
