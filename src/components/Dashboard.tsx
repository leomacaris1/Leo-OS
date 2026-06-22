'use client';

import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Activity, Zap, ShieldAlert, Cpu, Server, Network, Database,
  Layers, CreditCard, Bot, ArrowRight, Bell, TrendingUp, Clock
} from 'lucide-react';
import { Project, Subscription, AppNotification } from '../lib/supabase';

interface DashboardProps {
  projects: Project[];
  subscriptions: Subscription[];
  notifications: AppNotification[];
  backendMode: 'Cloud' | 'Local';
  onNavigate: (section: string) => void;
}

export default function Dashboard({ projects, subscriptions, notifications, backendMode, onNavigate }: DashboardProps) {
  const [metrics, setMetrics] = useState({
    cpu: 32,
    ram: 64,
    net: 18,
    db: 4
  });

  // Simulate dynamic fluctuations
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        cpu: Math.min(100, Math.max(10, prev.cpu + (Math.random() * 10 - 5))),
        ram: Math.min(100, Math.max(40, prev.ram + (Math.random() * 4 - 2))),
        net: Math.min(100, Math.max(5, prev.net + (Math.random() * 15 - 7))),
        db: Math.min(100, Math.max(1, prev.db + (Math.random() * 6 - 3)))
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Derived KPIs
  const activeProjects = projects.filter(p => p.progress < 100);
  const avgProgress = projects.length > 0 
    ? Math.round(projects.reduce((s, p) => s + p.progress, 0) / projects.length) 
    : 0;
  const monthlyBurn = subscriptions
    .filter(s => s.status === 'Active')
    .reduce((sum, s) => sum + (s.billing_cycle === 'Monthly' ? Number(s.cost) : Number(s.cost) / 12), 0);
  const unreadNotifs = notifications.filter(n => !n.read).length;
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Buenos días' : currentHour < 18 ? 'Buenas tardes' : 'Buenas noches';

  return (
    <div className="space-y-6">
      {/* Greeting Header */}
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-100 flex items-center gap-2">
          <LayoutDashboard className="w-8 h-8 text-cyan-400 glow-cyan" />
          {greeting}, Comandante
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          Centro de mando global — {new Date().toLocaleDateString('es-AR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Projects KPI */}
        <button 
          onClick={() => onNavigate('projects')}
          className="glass-card rounded-2xl p-5 border border-slate-800/60 hover:border-cyan-500/40 transition-all text-left group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-20 h-20 bg-cyan-500/5 rounded-full blur-2xl group-hover:bg-cyan-500/15 transition-colors"></div>
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 bg-cyan-950/30 rounded-lg border border-cyan-500/20">
              <Layers className="w-4 h-4 text-cyan-400" />
            </div>
            <ArrowRight className="w-3 h-3 text-slate-600 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="text-2xl font-extrabold text-white">{projects.length}</div>
          <div className="text-[11px] text-slate-500 uppercase font-mono tracking-wider mt-1">Proyectos</div>
          <div className="text-[10px] text-cyan-500/80 font-mono mt-2">{activeProjects.length} activos</div>
        </button>

        {/* Subscriptions KPI */}
        <button 
          onClick={() => onNavigate('accounts')}
          className="glass-card rounded-2xl p-5 border border-slate-800/60 hover:border-orange-500/40 transition-all text-left group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-20 h-20 bg-orange-500/5 rounded-full blur-2xl group-hover:bg-orange-500/15 transition-colors"></div>
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 bg-orange-950/30 rounded-lg border border-orange-500/20">
              <CreditCard className="w-4 h-4 text-orange-400" />
            </div>
            <ArrowRight className="w-3 h-3 text-slate-600 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="text-2xl font-extrabold text-white">${monthlyBurn.toFixed(0)}</div>
          <div className="text-[11px] text-slate-500 uppercase font-mono tracking-wider mt-1">Gasto Mensual</div>
          <div className="text-[10px] text-orange-500/80 font-mono mt-2">{subscriptions.filter(s => s.status === 'Active').length} suscripciones</div>
        </button>

        {/* Notifications KPI */}
        <div className="glass-card rounded-2xl p-5 border border-slate-800/60 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-rose-500/5 rounded-full blur-2xl"></div>
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 bg-rose-950/30 rounded-lg border border-rose-500/20">
              <Bell className="w-4 h-4 text-rose-400" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white">{unreadNotifs}</div>
          <div className="text-[11px] text-slate-500 uppercase font-mono tracking-wider mt-1">Sin Leer</div>
          <div className="text-[10px] text-rose-500/80 font-mono mt-2">{notifications.length} totales</div>
        </div>

        {/* System Status KPI */}
        <div className="glass-card rounded-2xl p-5 border border-slate-800/60 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/5 rounded-full blur-2xl"></div>
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 bg-emerald-950/30 rounded-lg border border-emerald-500/20">
              <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white">Online</div>
          <div className="text-[11px] text-slate-500 uppercase font-mono tracking-wider mt-1">Estado Core</div>
          <div className="text-[10px] text-emerald-500/80 font-mono mt-2">{backendMode === 'Cloud' ? '☁ Supabase' : '💾 Local Cache'}</div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Projects Overview + Recent Notifications */}
        <div className="lg:col-span-2 space-y-6">

          {/* Active Projects Strip */}
          <div className="glass-card rounded-2xl p-6 border border-slate-800/60">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-slate-200 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-cyan-400" />
                Proyectos en Progreso
              </h3>
              <button 
                onClick={() => onNavigate('projects')}
                className="text-xs text-cyan-500 hover:text-cyan-400 font-mono uppercase tracking-wider flex items-center gap-1 transition-colors"
              >
                Ver todos <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {activeProjects.length === 0 ? (
              <p className="text-slate-500 text-sm text-center py-6 font-mono">No hay proyectos activos.</p>
            ) : (
              <div className="space-y-4">
                {activeProjects.slice(0, 4).map(project => (
                  <div key={project.id} className="flex items-center gap-4 group">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-semibold text-slate-200 truncate">{project.name}</span>
                        <span className="text-xs font-mono text-cyan-500 ml-2 shrink-0">{project.progress}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                        <style>{`
                          .dashboard-progress-fill-${project.id} {
                            width: ${project.progress}%;
                          }
                        `}</style>
                        <div 
                          className={`h-full rounded-full transition-all duration-700 ease-out bg-gradient-to-r dashboard-progress-fill-${project.id} ${
                            project.progress >= 80 
                              ? 'from-cyan-500 to-emerald-500' 
                              : project.progress >= 50 
                                ? 'from-cyan-500 to-purple-500' 
                                : 'from-amber-500 to-red-500'
                          }`}
                        ></div>
                      </div>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[10px] text-slate-500">{project.status}</span>
                        {project.tech_stack && project.tech_stack.length > 0 && (
                          <div className="flex gap-1">
                            {project.tech_stack.slice(0, 3).map(tech => (
                              <span key={tech} className="text-[9px] bg-slate-900 border border-slate-800 text-slate-500 px-1.5 py-0.5 rounded">{tech}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Avg Progress Bar */}
            <div className="mt-6 pt-4 border-t border-slate-800">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Progreso Promedio Global</span>
                <span className="text-sm font-bold font-mono text-cyan-400">{avgProgress}%</span>
              </div>
              <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <style>{`
                  .dashboard-avg-progress-fill {
                    width: ${avgProgress}%;
                  }
                `}</style>
                <div 
                  className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full transition-all duration-1000 ease-out shadow-[0_0_12px_rgba(6,182,212,0.5)] dashboard-avg-progress-fill"
                ></div>
              </div>
            </div>
          </div>

          {/* Recent Notifications Feed */}
          <div className="glass-card rounded-2xl p-6 border border-slate-800/60">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-slate-200 flex items-center gap-2">
                <Bell className="w-5 h-5 text-rose-400" />
                Actividad Reciente
              </h3>
            </div>

            {notifications.length === 0 ? (
              <p className="text-slate-500 text-sm text-center py-6 font-mono">Sin actividad registrada.</p>
            ) : (
              <div className="space-y-3">
                {notifications.slice(0, 5).map(notif => (
                  <div key={notif.id} className={`flex items-start gap-3 p-3 rounded-xl transition-colors ${notif.read ? 'opacity-50' : 'bg-slate-900/40'}`}>
                    <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                      notif.type === 'error' ? 'bg-rose-400' :
                      notif.type === 'success' ? 'bg-emerald-400' :
                      notif.type === 'warning' ? 'bg-amber-400' : 'bg-cyan-400'
                    }`}></div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-slate-200 truncate">{notif.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5 truncate">{notif.message}</p>
                    </div>
                    <div className="text-[10px] text-slate-600 font-mono shrink-0 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: System Monitor */}
        <div className="space-y-6">
          {/* System Core Monitor */}
          <div className="glass-card rounded-2xl p-6 border border-slate-800/60 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-slate-900/50 to-transparent pointer-events-none"></div>
            
            {/* Dynamic style block for bar widths */}
            <style>{`
              #cpu-bar { width: ${metrics.cpu}%; }
              #ram-bar { width: ${metrics.ram}%; }
              #net-bar { width: ${metrics.net}%; }
              #db-bar { width: ${metrics.db}%; }
            `}</style>

            <div className="flex items-center gap-3 mb-6 relative z-10">
              <Server className="w-5 h-5 text-purple-400" />
              <h3 className="text-lg font-bold text-slate-200">Core Monitor</h3>
              <span className="ml-auto text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                LIVE
              </span>
            </div>

            <div className="space-y-5 relative z-10">
              {/* CPU */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Cpu className="w-3 h-3 text-cyan-400" /> Omni CPU
                  </span>
                  <span className="text-xs font-bold font-mono text-cyan-400">{Math.round(metrics.cpu)}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                  <div id="cpu-bar" className="h-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.8)] transition-all duration-500 ease-out"></div>
                </div>
              </div>

              {/* RAM */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Database className="w-3 h-3 text-purple-400" /> Neural RAM
                  </span>
                  <span className="text-xs font-bold font-mono text-purple-400">{Math.round(metrics.ram)}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                  <div id="ram-bar" className="h-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.8)] transition-all duration-500 ease-out"></div>
                </div>
              </div>

              {/* Net */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Network className="w-3 h-3 text-emerald-400" /> Net I/O
                  </span>
                  <span className="text-xs font-bold font-mono text-emerald-400">{Math.round(metrics.net)}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                  <div id="net-bar" className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)] transition-all duration-500 ease-out"></div>
                </div>
              </div>

              {/* DB */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Database className="w-3 h-3 text-rose-400" /> DB Threads
                  </span>
                  <span className="text-xs font-bold font-mono text-rose-400">{Math.round(metrics.db)}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                  <div id="db-bar" className="h-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.8)] transition-all duration-500 ease-out"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="glass-card rounded-2xl p-6 border border-slate-800/60">
            <h3 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              Accesos Rápidos
            </h3>
            <div className="space-y-2">
              {[
                { id: 'agents', label: 'Fábrica de Agentes', icon: Bot, color: 'text-cyan-400' },
                { id: 'logs', label: 'Telemetría en Vivo', icon: Activity, color: 'text-emerald-400' },
                { id: 'webhooks', label: 'Webhooks & API', icon: ShieldAlert, color: 'text-fuchsia-400' },
                { id: 'settings', label: 'Configuración', icon: Cpu, color: 'text-slate-400' },
              ].map(link => {
                const Icon = link.icon;
                return (
                  <button
                    key={link.id}
                    onClick={() => onNavigate(link.id)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl bg-slate-900/40 border border-slate-800/60 hover:border-slate-700 text-left transition-all group"
                  >
                    <Icon className={`w-4 h-4 ${link.color}`} />
                    <span className="text-sm text-slate-300 group-hover:text-slate-100 transition-colors">{link.label}</span>
                    <ArrowRight className="w-3 h-3 text-slate-700 ml-auto group-hover:text-slate-400 transition-colors" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
