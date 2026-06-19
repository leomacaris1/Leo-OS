import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Command, Terminal, Plus, Folder, Layout, Cpu, 
  Bot, CreditCard, Mail, Webhook, Settings, MessageSquare, Database
} from 'lucide-react';
import { dbService, Project, Agent, Subscription, EmailAccount } from '../lib/supabase';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (section: string) => void;
}

export default function CommandPalette({ isOpen, onClose, onNavigate }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Data states
  const [projects, setProjects] = useState<Project[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [emails, setEmails] = useState<EmailAccount[]>([]);
  const [loading, setLoading] = useState(false);

  // Focus input and fetch data when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 10);
      
      // Fetch all required search data
      const fetchSearchData = async () => {
        setLoading(true);
        try {
          const [projData, agentData, subData, emailData] = await Promise.all([
            dbService.getProjects(),
            dbService.getAgents(),
            dbService.getSubscriptions(),
            dbService.getEmails()
          ]);
          setProjects(projData);
          setAgents(agentData);
          setSubscriptions(subData);
          setEmails(emailData);
        } catch (err) {
          console.error("Error fetching OmniSearch data:", err);
        } finally {
          setLoading(false);
        }
      };

      fetchSearchData();
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

  const filteredAgents = agents.filter(a => 
    a.name.toLowerCase().includes(normalizedQuery) || 
    a.role.toLowerCase().includes(normalizedQuery)
  );

  const filteredSubscriptions = subscriptions.filter(s => 
    s.name.toLowerCase().includes(normalizedQuery) ||
    s.status.toLowerCase().includes(normalizedQuery) ||
    s.billing_cycle.toLowerCase().includes(normalizedQuery)
  );

  const filteredEmails = emails.filter(e => 
    e.email.toLowerCase().includes(normalizedQuery) ||
    (e.label && e.label.toLowerCase().includes(normalizedQuery))
  );

  const actions = [
    { id: 'nav-dashboard', label: 'Ir al Workspace (Dashboard)', icon: <Layout className="w-4 h-4 text-cyan-400" />, action: () => onNavigate('dashboard') },
    { id: 'nav-management', label: 'Ir al Command Center', icon: <Terminal className="w-4 h-4 text-purple-400" />, action: () => onNavigate('management') },
    { id: 'nav-agents', label: 'Ir a la Fábrica de Agentes', icon: <Bot className="w-4 h-4 text-rose-400" />, action: () => onNavigate('agents') },
    { id: 'nav-sandbox', label: 'Ir al Sandbox (Arena de Agentes)', icon: <MessageSquare className="w-4 h-4 text-amber-500" />, action: () => onNavigate('sandbox') },
    { id: 'nav-database', label: 'Ir a Database (Data Explorer)', icon: <Database className="w-4 h-4 text-fuchsia-400" />, action: () => onNavigate('database') },
    { id: 'nav-webhooks', label: 'Ir a Webhooks & Eventos', icon: <Webhook className="w-4 h-4 text-amber-400" />, action: () => onNavigate('webhooks') },
    { id: 'nav-logs', label: 'Ver Logs del Sistema', icon: <Cpu className="w-4 h-4 text-emerald-400" />, action: () => onNavigate('logs') },
    { id: 'create-project', label: 'Crear Nuevo Proyecto', icon: <Plus className="w-4 h-4 text-cyan-400" />, action: () => onNavigate('projects') },
    { id: 'open-settings', label: 'Ajustes del Sistema', icon: <Settings className="w-4 h-4 text-slate-400" />, action: () => onNavigate('settings') },
  ].filter(a => a.label.toLowerCase().includes(normalizedQuery));

  const totalResults = filteredProjects.length + filteredAgents.length + filteredSubscriptions.length + filteredEmails.length + actions.length;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] sm:pt-[20vh] bg-slate-950/60 backdrop-blur-sm px-4">
      <div className="w-full max-w-2xl bg-[#0a0e1a] border border-cyan-500/30 shadow-[0_0_50px_rgba(6,182,212,0.1)] rounded-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Search Input Area */}
        <div className="flex items-center px-4 py-4 border-b border-slate-800 bg-slate-900/40 relative">
          <Search className={`w-5 h-5 mr-3 transition-colors ${query ? 'text-cyan-400' : 'text-slate-500'}`} />
          <input
            ref={inputRef}
            type="text"
            className="flex-1 bg-transparent border-none text-slate-100 placeholder-slate-500 text-lg focus:outline-none focus:ring-0"
            placeholder="OmniSearch: proyectos, agentes, emails, comandos..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {loading && (
            <div className="absolute bottom-0 left-0 h-0.5 bg-cyan-500 animate-pulse w-full"></div>
          )}
          <div className="flex items-center gap-1 text-[10px] text-slate-500 font-mono ml-4">
            <kbd className="bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">ESC</kbd>
            <span>cerrar</span>
          </div>
        </div>

        {/* Results Area */}
        <div className="max-h-[60vh] overflow-y-auto p-2 bg-slate-950/20">
          
          {/* Default state when empty */}
          {query === '' && (
            <div className="px-4 py-10 text-center text-slate-500">
              <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mx-auto mb-4">
                <Command className="w-8 h-8 text-cyan-500/50" />
              </div>
              <p className="text-sm font-medium text-slate-400 mb-1">OmniSearch Activo</p>
              <p className="text-xs text-slate-500">Busca en todo tu ecosistema Leo OS de forma instantánea</p>
            </div>
          )}

          {/* Quick Actions / Commands */}
          {actions.length > 0 && (
            <div className="mb-4">
              <div className="px-3 py-2 text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5" />
                Comandos del Sistema
              </div>
              <ul className="space-y-1 mt-1">
                {actions.map((action) => (
                  <li key={action.id}>
                    <button
                      onClick={() => {
                        action.action();
                        onClose();
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800 text-left transition-colors group focus:bg-slate-800 focus:outline-none"
                    >
                      <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 group-hover:border-cyan-500/50 transition-colors">
                        {action.icon}
                      </div>
                      <span className="text-slate-300 group-hover:text-white font-medium transition-colors">
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
            <div className="mb-4">
              <div className="px-3 py-2 text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Folder className="w-3.5 h-3.5" />
                Proyectos
              </div>
              <ul className="space-y-1 mt-1">
                {filteredProjects.map((project) => (
                  <li key={project.id}>
                    <button
                      onClick={() => {
                        onNavigate('dashboard');
                        onClose();
                      }}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-cyan-500/10 hover:border-cyan-500/30 border border-transparent text-left transition-all group focus:bg-cyan-500/10 focus:outline-none"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 group-hover:border-cyan-500/50 group-hover:bg-cyan-500/20 text-cyan-400">
                          <Folder className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-slate-200 group-hover:text-cyan-400 font-medium block">
                            {project.name}
                          </span>
                          {project.description && (
                            <span className="text-xs text-slate-500 line-clamp-1">
                              {project.description}
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="text-xs font-mono px-2 py-1 bg-slate-950 rounded-md text-cyan-400 border border-cyan-500/20">
                        {project.progress}%
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Agents */}
          {filteredAgents.length > 0 && (
            <div className="mb-4">
              <div className="px-3 py-2 text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Bot className="w-3.5 h-3.5" />
                Agentes
              </div>
              <ul className="space-y-1 mt-1">
                {filteredAgents.map((agent) => (
                  <li key={agent.id}>
                    <button
                      onClick={() => {
                        onNavigate('agents');
                        onClose();
                      }}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-rose-500/10 hover:border-rose-500/30 border border-transparent text-left transition-all group focus:bg-rose-500/10 focus:outline-none"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 group-hover:border-rose-500/50 group-hover:bg-rose-500/20 text-rose-400">
                          <Bot className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-slate-200 group-hover:text-rose-400 font-medium block">
                            {agent.name}
                          </span>
                          <span className="text-xs text-slate-500">
                            Rol: {agent.role}
                          </span>
                        </div>
                      </div>
                      <div className={`px-2 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase border ${
                        agent.status === 'online'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}>
                        {agent.status}
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Subscriptions */}
          {filteredSubscriptions.length > 0 && (
            <div className="mb-4">
              <div className="px-3 py-2 text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <CreditCard className="w-3.5 h-3.5" />
                Suscripciones
              </div>
              <ul className="space-y-1 mt-1">
                {filteredSubscriptions.map((sub) => (
                  <li key={sub.id}>
                    <button
                      onClick={() => {
                        onNavigate('management');
                        onClose();
                      }}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-emerald-500/10 hover:border-emerald-500/30 border border-transparent text-left transition-all group focus:bg-emerald-500/10 focus:outline-none"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 group-hover:border-emerald-500/50 group-hover:bg-emerald-500/20 text-emerald-400">
                          <CreditCard className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-slate-200 group-hover:text-emerald-400 font-medium block">
                            {sub.name}
                          </span>
                          <span className="text-xs text-slate-500">
                            {sub.status} • {sub.billing_cycle}
                          </span>
                        </div>
                      </div>
                      <span className="text-sm font-mono text-emerald-400 font-bold">
                        ${sub.cost.toFixed(2)}/{sub.billing_cycle === 'Monthly' ? 'mo' : 'yr'}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Emails */}
          {filteredEmails.length > 0 && (
            <div className="mb-4">
              <div className="px-3 py-2 text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Mail className="w-3.5 h-3.5" />
                Correos
              </div>
              <ul className="space-y-1 mt-1">
                {filteredEmails.map((email) => (
                  <li key={email.id}>
                    <button
                      onClick={() => {
                        onNavigate('management');
                        onClose();
                      }}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-purple-500/10 hover:border-purple-500/30 border border-transparent text-left transition-all group focus:bg-purple-500/10 focus:outline-none"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 group-hover:border-purple-500/50 group-hover:bg-purple-500/20 text-purple-400">
                          <Mail className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-slate-200 group-hover:text-purple-400 font-medium block">
                            {email.email}
                          </span>
                          <span className="text-xs text-slate-500">
                            Email {email.label && `• ${email.label}`}
                          </span>
                        </div>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* No results */}
          {query !== '' && totalResults === 0 && (
            <div className="px-4 py-12 text-center text-slate-500">
              <Search className="w-8 h-8 text-slate-600 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No encontramos ningún resultado para &quot;<span className="text-slate-300 font-medium">{query}</span>&quot;</p>
              <p className="text-xs text-slate-600 mt-1">Prueba buscar con otros términos o crear un nuevo recurso.</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
