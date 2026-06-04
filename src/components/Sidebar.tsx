'use client';

import React from 'react';
import { 
  LayoutDashboard, 
  Terminal, 
  Settings, 
  Layers, 
  Mail, 
  CreditCard,
  Shield,
  Activity,
  Bot
} from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  stats: {
    projectsCount: number;
    activeProjectsCount: number;
    emailsCount: number;
    monthlySubsCost: number;
  };
}

export default function Sidebar({ activeSection, setActiveSection, stats }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, desc: 'Vista Global' },
    { id: 'projects', label: 'Projects', icon: Layers, desc: 'Gestión de Núcleos' },
    { id: 'agents', label: 'Agents', icon: Bot, desc: 'Flota Autónoma' },
    { id: 'terminal', label: 'Terminal', icon: Terminal, desc: 'Simulador de Comandos' },
    { id: 'logs', label: 'Logs', icon: Activity, desc: 'Telemetría Real' },
    { id: 'accounts', label: 'Accounts', icon: CreditCard, desc: 'Identidades y Finanzas' },
    { id: 'settings', label: 'Settings', icon: Settings, desc: 'Preferencias del Sistema' },
  ];

  return (
    <aside className="w-80 h-screen glass-panel border-r border-slate-800/60 p-6 flex flex-col justify-between shrink-0">
      {/* Top Section - Brand */}
      <div>
        <div className="flex items-center gap-3 mb-8">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-cyan-950/50 border border-cyan-500/30 text-cyan-400">
            <Shield className="w-5 h-5 glow-cyan" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-950 pulse-emerald"></span>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-wider bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
              LEO OS
            </h1>
            <p className="text-xs text-slate-500 font-mono tracking-widest">PERSONAL CORE v1.0</p>
          </div>
        </div>

        {/* Menu Navigation */}
        <div className="space-y-2 mb-8">
          <div className="text-[10px] font-mono tracking-widest text-slate-500 uppercase px-3 mb-3">
            Sistemas Principales
          </div>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-left transition-all duration-300 border ${
                  isActive
                    ? 'bg-slate-900/80 border-cyan-500/30 text-cyan-400 font-medium'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-950/40 hover:border-slate-800/40'
                }`}
              >
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-cyan-400 glow-cyan animate-pulse' : 'text-slate-400'}`} />
                <div>
                  <div className="text-sm tracking-wide">{item.label}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5 font-sans leading-none">{item.desc}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Section - Telemetry Metrics */}
      <div className="space-y-4">
        <div className="text-[10px] font-mono tracking-widest text-slate-500 uppercase px-3">
          Métricas de Estado
        </div>
        
        <div className="space-y-2">
          {/* Projects Metric */}
          <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-900/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span className="text-xs text-slate-400">Proyectos Activos</span>
            </div>
            <span className="font-mono text-sm text-emerald-300 font-bold bg-emerald-950/20 px-2 py-0.5 rounded border border-emerald-900/30">
              {stats.activeProjectsCount} / {stats.projectsCount}
            </span>
          </div>

          {/* Emails Metric */}
          <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-900/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-cyan-400" />
              <span className="text-xs text-slate-400">Identidades Email</span>
            </div>
            <span className="font-mono text-sm text-cyan-300 font-bold bg-cyan-950/20 px-2 py-0.5 rounded border border-cyan-900/30">
              {stats.emailsCount}
            </span>
          </div>

          {/* Finance Budget Metric */}
          <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-900/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-orange-400" />
              <span className="text-xs text-slate-400">Costo Suscripciones</span>
            </div>
            <span className="font-mono text-sm text-orange-300 font-bold bg-orange-950/20 px-2 py-0.5 rounded border border-orange-900/30">
              ${stats.monthlySubsCost.toFixed(2)}<span className="text-[10px] text-slate-500 font-normal">/mes</span>
            </span>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center pt-2 border-t border-slate-900">
          <p className="text-[10px] text-slate-600 font-mono">
            SYS STATUS: ONLINE
          </p>
          <p className="text-[8px] text-slate-700 font-mono mt-0.5">
            LOCAL STORAGE / CLOUD ACTIVE
          </p>
        </div>
      </div>
    </aside>
  );
}
