import React, { useState, useEffect, useRef } from 'react';
import { Search, Command, Terminal, Plus, Folder, Layout, Cpu } from 'lucide-react';
import { Project } from '../lib/supabase';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  onNavigate: (section: string) => void;
  onCreateProject: () => void;
}

export default function CommandPalette({ isOpen, onClose, projects, onNavigate, onCreateProject }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 10);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Handle escape key specifically inside the palette (handled globally in layout/page too)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Search logic
  const normalizedQuery = query.toLowerCase().trim();
  
  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(normalizedQuery) || 
    (p.description && p.description.toLowerCase().includes(normalizedQuery))
  );

  const actions = [
    { id: 'nav-dashboard', label: 'Ir al Workspace de Proyectos', icon: <Layout className="w-4 h-4 text-cyan-400" />, action: () => onNavigate('dashboard') },
    { id: 'nav-management', label: 'Ir al Command Center', icon: <Terminal className="w-4 h-4 text-purple-400" />, action: () => onNavigate('management') },
    { id: 'nav-logs', label: 'Ver Logs del Sistema', icon: <Cpu className="w-4 h-4 text-emerald-400" />, action: () => onNavigate('logs') },
    { id: 'create-project', label: 'Crear Nuevo Proyecto', icon: <Plus className="w-4 h-4 text-amber-400" />, action: onCreateProject },
  ].filter(a => a.label.toLowerCase().includes(normalizedQuery));

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] sm:pt-[20vh] bg-slate-950/60 backdrop-blur-sm px-4">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 shadow-2xl rounded-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Search Input Area */}
        <div className="flex items-center px-4 py-4 border-b border-slate-800 bg-slate-950/50">
          <Search className="w-5 h-5 text-cyan-500 mr-3" />
          <input
            ref={inputRef}
            type="text"
            className="flex-1 bg-transparent border-none text-slate-100 placeholder-slate-500 text-lg focus:outline-none focus:ring-0"
            placeholder="Buscar proyectos, acciones o comandos..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="flex items-center gap-1 text-[10px] text-slate-500 font-mono">
            <kbd className="bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">ESC</kbd>
            <span>cerrar</span>
          </div>
        </div>

        {/* Results Area */}
        <div className="max-h-[60vh] overflow-y-auto p-2">
          
          {/* Default state when empty */}
          {query === '' && (
            <div className="px-4 py-8 text-center text-slate-500">
              <Command className="w-10 h-10 mx-auto mb-3 opacity-20" />
              <p className="text-sm">¿Qué deseas hacer hoy?</p>
            </div>
          )}

          {/* Quick Actions */}
          {actions.length > 0 && (
            <div className="mb-4">
              <div className="px-3 py-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Acciones del Sistema
              </div>
              <ul className="space-y-1 mt-1">
                {actions.map((action) => (
                  <li key={action.id}>
                    <button
                      onClick={() => {
                        action.action();
                        onClose();
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800/80 text-left transition-colors group"
                    >
                      <div className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 group-hover:border-slate-700">
                        {action.icon}
                      </div>
                      <span className="text-slate-300 group-hover:text-slate-100 font-medium">
                        {action.label}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Projects */}
          {filteredProjects.length > 0 && (
            <div>
              <div className="px-3 py-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Proyectos ({filteredProjects.length})
              </div>
              <ul className="space-y-1 mt-1">
                {filteredProjects.map((project) => (
                  <li key={project.id}>
                    <button
                      onClick={() => {
                        // Action could be filtering the dashboard to this project, or opening it
                        onNavigate('dashboard');
                        // Optional: emit an event or state to auto-open project edit
                        onClose();
                      }}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-800/80 text-left transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 group-hover:border-cyan-500/30">
                          <Folder className="w-4 h-4 text-cyan-400" />
                        </div>
                        <div>
                          <span className="text-slate-200 group-hover:text-cyan-400 font-medium block">
                            {project.name}
                          </span>
                          <span className="text-xs text-slate-500">
                            Estado: {project.status}
                          </span>
                        </div>
                      </div>
                      <span className="text-xs font-mono px-2 py-1 bg-slate-950 rounded-md text-slate-400 border border-slate-800">
                        {project.progress}%
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* No results */}
          {query !== '' && actions.length === 0 && filteredProjects.length === 0 && (
            <div className="px-4 py-8 text-center text-slate-500">
              <p className="text-sm">No se encontraron resultados para &quot;{query}&quot;</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
