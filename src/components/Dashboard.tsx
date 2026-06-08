'use client';

import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Activity, Zap, ShieldAlert, Cpu, Server, Network, Database } from 'lucide-react';

export default function Dashboard() {
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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-100 flex items-center gap-2">
          <LayoutDashboard className="w-8 h-8 text-cyan-400 glow-cyan" />
          Dashboard Global
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          Visión general del estado del sistema operativo y KPIs principales.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card rounded-2xl p-6 border flex items-center gap-4 relative overflow-hidden group hover:border-cyan-500/50 transition-colors">
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-colors"></div>
          <div className="w-12 h-12 rounded-xl bg-cyan-950/20 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Activity className="w-6 h-6 animate-pulse glow-cyan" />
          </div>
          <div>
            <div className="text-xs text-cyan-400/80 uppercase font-bold tracking-widest mb-1">Estado del Sistema</div>
            <div className="text-2xl font-extrabold text-white mt-0.5">Optimo</div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 border flex items-center gap-4 relative overflow-hidden group hover:border-emerald-500/50 transition-colors">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-colors"></div>
          <div className="w-12 h-12 rounded-xl bg-emerald-950/20 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 uppercase font-mono tracking-wider">Carga de Agentes</div>
            <div className="text-2xl font-extrabold text-slate-100 mt-0.5">{Math.round(metrics.cpu)}%</div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 border flex items-center gap-4 relative overflow-hidden group hover:border-rose-500/50 transition-colors">
          <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/10 rounded-full blur-2xl group-hover:bg-rose-500/20 transition-colors"></div>
          <div className="w-12 h-12 rounded-xl bg-rose-950/20 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 uppercase font-mono tracking-wider">Alertas Activas</div>
            <div className="text-2xl font-extrabold text-slate-100 mt-0.5">0</div>
          </div>
        </div>
      </div>

      {/* System Core Monitor */}
      <div className="glass-card rounded-2xl p-8 border mt-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-slate-900/50 to-transparent pointer-events-none"></div>
        
        {/* Dynamic style block to avoid inline styles */}
        <style>{`
          #cpu-bar { width: ${metrics.cpu}%; }
          #ram-bar { width: ${metrics.ram}%; }
          #net-bar { width: ${metrics.net}%; }
          #db-bar { width: ${metrics.db}%; }
        `}</style>

        <div className="flex items-center gap-3 mb-8 relative z-10">
          <Server className="w-6 h-6 text-purple-400" />
          <h3 className="text-xl font-bold text-slate-200">System Core Monitor</h3>
          <span className="ml-auto text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-md flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
            LIVE
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
          {/* CPU Metric */}
          <div className="space-y-2">
            <div className="flex justify-between items-end">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" /> Omni Engine CPU
              </span>
              <span className="text-sm font-bold font-mono text-cyan-400">{Math.round(metrics.cpu)}%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
              <div 
                id="cpu-bar"
                className="h-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.8)] transition-all duration-500 ease-out"
              ></div>
            </div>
          </div>

          {/* Memory Metric */}
          <div className="space-y-2">
            <div className="flex justify-between items-end">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-purple-400" /> Neural Memory (RAM)
              </span>
              <span className="text-sm font-bold font-mono text-purple-400">{Math.round(metrics.ram)}%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
              <div 
                id="ram-bar"
                className="h-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.8)] transition-all duration-500 ease-out"
              ></div>
            </div>
          </div>

          {/* Network Metric */}
          <div className="space-y-2">
            <div className="flex justify-between items-end">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <Network className="w-3.5 h-3.5 text-emerald-400" /> Net I/O Streams
              </span>
              <span className="text-sm font-bold font-mono text-emerald-400">{Math.round(metrics.net)}%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
              <div 
                id="net-bar"
                className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)] transition-all duration-500 ease-out"
              ></div>
            </div>
          </div>

          {/* Database Metric */}
          <div className="space-y-2">
            <div className="flex justify-between items-end">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-rose-400" /> Supabase Threads
              </span>
              <span className="text-sm font-bold font-mono text-rose-400">{Math.round(metrics.db)}%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
              <div 
                id="db-bar"
                className="h-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.8)] transition-all duration-500 ease-out"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
