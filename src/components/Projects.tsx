'use client';

import React, { useState, useEffect } from 'react';
import { 
  Project 
} from '../lib/supabase';
import { 
  Plus, 
  Edit3, 
  Layers, 
  Sliders,
  X,
  Sparkles,
  Github,
  ExternalLink,
  CheckSquare,
  LayoutList,
  Grid
} from 'lucide-react';
import ProjectAuditModal from './ProjectAuditModal';
import { toast } from 'sonner';

interface ProjectsProps {
  projects: Project[];
  onUpdateProject: (id: string, updates: Partial<Project>) => Promise<void>;
  onCreateProject: (project: Omit<Project, 'id'>) => Promise<void>;
}

export default function Projects({ projects, onUpdateProject, onCreateProject }: ProjectsProps) {
  // UI states
  const [viewMode, setViewMode] = useState<'grid' | 'compact'>('grid');
  const [filterStatus, setFilterStatus] = useState<'Todos' | 'Producción' | 'Desarrollo' | 'Estrategia'>('Todos');

  // Hotkeys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLSelectElement) {
        return;
      }
      
      if (e.key.toLowerCase() === 'n') {
        setIsAddingProject(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Modal states
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [auditingProject, setAuditingProject] = useState<Project | null>(null);

  // Form states for creating a new project
  const [newName, setNewName] = useState('');
  const [newStatus, setNewStatus] = useState('In Progress');
  const [newProgress, setNewProgress] = useState(0);
  const [newTags, setNewTags] = useState('');
  const [newRepoUrl, setNewRepoUrl] = useState('');
  const [newLiveUrl, setNewLiveUrl] = useState('');
  const [newDescription, setNewDescription] = useState('');

  // Form states for editing a project
  const [editName, setEditName] = useState('');
  const [editStatus, setEditStatus] = useState('');
  const [editProgress, setEditProgress] = useState(0);
  const [editTags, setEditTags] = useState('');
  const [editRepoUrl, setEditRepoUrl] = useState('');
  const [editLiveUrl, setEditLiveUrl] = useState('');
  const [editDescription, setEditDescription] = useState('');

  // Handle opening edit modal
  const openEditModal = (project: Project) => {
    setEditingProject(project);
    setEditName(project.name);
    setEditStatus(project.status);
    setEditProgress(project.progress);
    setEditTags(project.tech_stack.join(', '));
    setEditRepoUrl(project.repo_url || '');
    setEditLiveUrl(project.live_url || '');
    setEditDescription(project.description || '');
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
    if (editProgress === 100 && !editStatus.includes('🟢')) {
      finalStatus = '🟢 Completed';
    }

    await onUpdateProject(editingProject.id, {
      name: editName,
      status: finalStatus,
      progress: editProgress,
      tech_stack: parsedTags,
      repo_url: editRepoUrl || undefined,
      live_url: editLiveUrl || undefined,
      description: editDescription || undefined
    });

    toast.success('Proyecto actualizado en Leo OS Core', {
      description: `El estado de ${editName} ha sido sincronizado.`,
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
    if (newProgress === 100 && !newStatus.includes('🟢')) {
      finalStatus = '🟢 Completed';
    }

    await onCreateProject({
      name: newName,
      status: finalStatus,
      progress: newProgress,
      tech_stack: parsedTags.length > 0 ? parsedTags : ['React'],
      repo_url: newRepoUrl || undefined,
      live_url: newLiveUrl || undefined,
      description: newDescription || undefined
    });

    toast.success('Nuevo núcleo desplegado', {
      description: `${newName} ha sido inicializado en el ecosistema.`,
    });

    // Reset fields
    setNewName('');
    setNewStatus('In Progress');
    setNewProgress(0);
    setNewTags('');
    setNewRepoUrl('');
    setNewLiveUrl('');
    setNewDescription('');
    setIsAddingProject(false);
  };

  // Helper for status badge colors - supports emoji-prefixed free-form status
  const getStatusStyle = (status: string) => {
    // Detect by emoji prefix
    if (status.startsWith('🟢')) return {
      bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
      dot: 'bg-emerald-400 shadow-[0_0_8px_#10b981]'
    };
    if (status.startsWith('🟡')) return {
      bg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
      dot: 'bg-amber-400 shadow-[0_0_8px_#f59e0b]'
    };
    if (status.startsWith('🔵')) return {
      bg: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
      dot: 'bg-blue-400 shadow-[0_0_8px_#3b82f6]'
    };
    if (status.startsWith('🟣')) return {
      bg: 'bg-purple-500/10 border-purple-500/30 text-purple-400',
      dot: 'bg-purple-400 shadow-[0_0_8px_#a855f7]'
    };
    // Legacy fixed-value fallbacks
    if (status === 'Completed') return {
      bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
      dot: 'bg-emerald-400 shadow-[0_0_8px_#10b981]'
    };
    if (status === 'In Progress') return {
      bg: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
      dot: 'bg-blue-400 shadow-[0_0_8px_#3b82f6]'
    };
    if (status === 'Active') return {
      bg: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400',
      dot: 'bg-cyan-400 shadow-[0_0_8px_#06b6d4]'
    };
    if (status === 'On Hold') return {
      bg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
      dot: 'bg-amber-400 shadow-[0_0_8px_#f59e0b]'
    };
    return {
      bg: 'bg-slate-500/10 border-slate-500/30 text-slate-400',
      dot: 'bg-slate-400'
    };
  };

  return (
    <div className="space-y-6 relative z-0 p-4 -m-4">
      {/* Subtle radial background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/10 via-transparent to-transparent -z-10 pointer-events-none rounded-3xl" />
      
      {/* Header Area */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-100 flex items-center gap-2">
            <Layers className="w-8 h-8 text-cyan-400 glow-cyan animate-pulse" />
            Workspace de Proyectos
          </h2>
          <p className="text-slate-400 text-sm mt-1 mb-3">
            Supervisión y control de proyectos activos en Leo OS.
          </p>
          <div className="flex flex-wrap items-center gap-3 mt-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 bg-slate-900/50 px-2.5 py-1 rounded-md border border-slate-800">
              <span className="text-cyan-400 glow-cyan text-sm">⚡</span> {projects.length} Núcleos Activos
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 bg-slate-900/50 px-2.5 py-1 rounded-md border border-slate-800">
              <span className="text-emerald-400 glow-emerald text-sm">🟢</span> {projects.filter(p => p.progress >= 90).length} En Producción
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 bg-slate-900/50 px-2.5 py-1 rounded-md border border-slate-800">
              <span className="text-amber-400 glow-amber text-sm">🛠️</span> {projects.filter(p => p.progress < 90 && p.progress > 0).length} En Desarrollo
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsAddingProject(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-slate-900 font-bold px-4 py-2.5 rounded-xl transition-all duration-300 shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] transform hover:scale-[1.02]"
        >
          <Plus className="w-5 h-5" />
          Nuevo Proyecto
        </button>
      </div>

      {/* Controls Bar: Filters and View Mode */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-8 mb-4 border-b border-slate-900 pb-4 relative z-10">
        <div className="flex flex-wrap gap-2">
          {['Todos', 'Producción', 'Desarrollo', 'Estrategia'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status as 'Todos' | 'Producción' | 'Desarrollo' | 'Estrategia')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                filterStatus === status 
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.2)]' 
                  : 'bg-slate-900/50 text-slate-400 border border-slate-800 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1 bg-slate-900/50 p-1 rounded-lg border border-slate-800">
          <button 
            onClick={() => setViewMode('grid')}
            title="Vista Detallada"
            className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-slate-800 text-cyan-400 shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <Grid className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setViewMode('compact')}
            title="Vista Compacta"
            className={`p-1.5 rounded-md transition-all ${viewMode === 'compact' ? 'bg-slate-800 text-cyan-400 shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <LayoutList className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Projects Container */}
      <div className={`relative z-10 ${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-8' : 'flex flex-col gap-3'}`}>
        {projects.filter(p => {
          if (filterStatus === 'Todos') return true;
          if (filterStatus === 'Producción') return p.progress >= 90;
          if (filterStatus === 'Desarrollo') return p.progress < 90 && p.progress > 0;
          if (filterStatus === 'Estrategia') return p.progress === 0;
          return true;
        }).map((project) => {
          const statusStyle = getStatusStyle(project.status);
          
          if (viewMode === 'compact') {
            return (
              <div key={project.id} className="glass-card rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between border group hover:bg-slate-900/80 transition-all duration-300 gap-4 sm:gap-0">
                <div className="flex items-center gap-4 w-full sm:w-1/3">
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-slate-200 group-hover:text-cyan-300 transition-colors">
                      {project.name}
                    </h3>
                  </div>
                </div>
                
                <div className="flex items-center justify-between sm:justify-center gap-6 w-full sm:w-1/3">
                  <div className="flex items-center gap-3 w-48">
                    <span className={`font-bold text-sm ${
                        project.progress >= 90 ? 'text-emerald-400' : 
                        project.progress >= 60 ? 'text-cyan-400' : 
                        'text-amber-400'
                      }`}>{project.progress}%</span>
                    <div className="w-full h-1.5 bg-slate-900/80 rounded-full overflow-hidden border border-slate-800/50">
                      <style>{`
                        .progress-bar-fill-compact-${project.id} {
                          width: ${project.progress}%;
                        }
                      `}</style>
                      <div 
                        className={`h-full rounded-full progress-bar-fill-compact-${project.id} bg-gradient-to-r ${
                          project.progress >= 90 ? 'from-emerald-500 to-teal-400' : project.progress >= 60 ? 'from-cyan-500 to-blue-500' : 'from-amber-500 to-orange-400'
                        }`}
                      ></div>
                    </div>
                  </div>
                  <span className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border whitespace-nowrap ${statusStyle.bg}`}>
                    <span className={`w-1 h-1 rounded-full ${statusStyle.dot}`}></span>
                    {project.status}
                  </span>
                </div>

                <div className="flex items-center gap-2 justify-end w-full sm:w-1/3">
                  <button
                    onClick={() => setAuditingProject(project)}
                    className="p-1.5 rounded-md text-teal-400 bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/30 transition-colors"
                    title="Auditar"
                  >
                    <CheckSquare className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => openEditModal(project)}
                    className="p-1.5 rounded-md text-slate-400 hover:text-cyan-400 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 transition-colors"
                    title="Editar"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          }

          return (
            <div key={project.id} className="glass-card rounded-2xl p-6 flex flex-col justify-between border relative overflow-hidden group hover:scale-[1.01] hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] transition-all duration-300 bg-slate-950/50 hover:bg-slate-900/80">
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
                <div className="mb-4 space-y-2">
                  <div className="flex justify-between items-end text-xs font-mono">
                    <span className="text-slate-400 mb-1">Progreso del Sistema</span>
                    <span className={`font-bold text-xl ${
                      project.progress >= 90 ? 'text-emerald-400 glow-emerald' : 
                      project.progress >= 60 ? 'text-cyan-400 glow-cyan' : 
                      'text-amber-400 glow-amber'
                    }`}>{project.progress}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-900/80 rounded-full overflow-hidden border border-slate-800/50 p-[1px]">
                    <style>{`
                      .progress-bar-fill-${project.id} {
                        width: ${project.progress}%;
                      }
                    `}</style>
                    <div 
                      className={`h-full rounded-full progress-bar-fill-${project.id} bg-gradient-to-r ${
                        project.progress >= 90 
                          ? 'from-emerald-500 to-teal-400' 
                          : project.progress >= 60
                          ? 'from-cyan-500 to-blue-500'
                          : 'from-amber-500 to-orange-400'
                      }`}
                    ></div>
                  </div>
                </div>

                {/* Description */}
                {project.description && (
                  <p className="text-xs text-slate-500 leading-relaxed mb-2 line-clamp-2">
                    {project.description}
                  </p>
                )}
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

                <div className="flex items-center gap-2 mt-3 sm:mt-0 w-full sm:w-auto flex-wrap justify-end">
                  {project.repo_url && (
                    <a
                      href={project.repo_url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white font-medium bg-slate-900 hover:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 transition-all duration-300"
                      title="Ver Código"
                    >
                      <Github className="w-3.5 h-3.5" />
                      Código
                    </a>
                  )}
                  {project.live_url && (
                    <a
                      href={project.live_url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 text-xs text-teal-400 hover:text-teal-300 font-medium bg-teal-950/20 hover:bg-teal-950/40 px-3 py-1.5 rounded-lg border border-teal-500/30 transition-all duration-300"
                      title="Ver Live"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Live
                    </a>
                  )}
                  <button
                    onClick={() => setAuditingProject(project)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-900 bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-300 hover:to-emerald-300 hover:shadow-[0_0_15px_rgba(45,212,191,0.4)] transition-all duration-300 transform hover:-translate-y-0.5"
                  >
                    <CheckSquare className="w-3.5 h-3.5" />
                    Auditar
                  </button>
                  <button 
                    onClick={() => openEditModal(project)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 bg-transparent hover:bg-slate-800 border border-slate-700 hover:border-slate-500 hover:text-slate-200 transition-all duration-300"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    Editar
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {auditingProject && (
        <ProjectAuditModal
          project={auditingProject}
          onClose={() => setAuditingProject(null)}
        />
      )}

      {/* Edit Project Modal */}
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
                    onChange={(e) => setEditStatus(e.target.value)}
                    title="Estado del Proyecto"
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-2 text-slate-200 focus:outline-none focus:border-cyan-500/50"
                  >
                    <option value="🟢 Full Green">🟢 Full Green</option>
                    <option value="🟢 MVP Funcional">🟢 MVP Funcional</option>
                    <option value="🟢 Motor Activo">🟢 Motor Activo</option>
                    <option value="🟡 Conectando LLM">🟡 Conectando LLM</option>
                    <option value="🟡 En Desarrollo">🟡 En Desarrollo</option>
                    <option value="🔵 Estrategia">🔵 Estrategia</option>
                    <option value="🟣 En Producción">🟣 En Producción</option>
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 mb-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">URL Repositorio</label>
                  <input
                    type="url"
                    value={editRepoUrl}
                    onChange={(e) => setEditRepoUrl(e.target.value)}
                    placeholder="https://github.com/..."
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-2 text-slate-200 focus:outline-none focus:border-cyan-500/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">URL Live</label>
                  <input
                    type="url"
                    value={editLiveUrl}
                    onChange={(e) => setEditLiveUrl(e.target.value)}
                    placeholder="https://vercel.app/..."
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-2 text-slate-200 focus:outline-none focus:border-cyan-500/50"
                  />
                </div>
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
                    onChange={(e) => setNewStatus(e.target.value)}
                    title="Estado del Proyecto"
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-2 text-slate-200 focus:outline-none focus:border-cyan-500/50"
                  >
                    <option value="🟢 Full Green">🟢 Full Green</option>
                    <option value="🟢 MVP Funcional">🟢 MVP Funcional</option>
                    <option value="🟢 Motor Activo">🟢 Motor Activo</option>
                    <option value="🟡 Conectando LLM">🟡 Conectando LLM</option>
                    <option value="🟡 En Desarrollo">🟡 En Desarrollo</option>
                    <option value="🔵 Estrategia">🔵 Estrategia</option>
                    <option value="🟣 En Producción">🟣 En Producción</option>
                    <option value="In Progress">In Progress</option>
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

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Descripción / Misión
                </label>
                <textarea 
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="El propósito de este proyecto es..."
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-2 text-slate-200 focus:outline-none focus:border-cyan-500/50 min-h-[80px]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 mb-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">URL Repositorio</label>
                  <input
                    type="url"
                    value={newRepoUrl}
                    onChange={(e) => setNewRepoUrl(e.target.value)}
                    placeholder="https://github.com/..."
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-2 text-slate-200 focus:outline-none focus:border-cyan-500/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">URL Live</label>
                  <input
                    type="url"
                    value={newLiveUrl}
                    onChange={(e) => setNewLiveUrl(e.target.value)}
                    placeholder="https://vercel.app/..."
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-2 text-slate-200 focus:outline-none focus:border-cyan-500/50"
                  />
                </div>
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
