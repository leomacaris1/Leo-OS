'use client';

import React from 'react';
import { LayoutDashboard, Activity, Zap, ShieldAlert } from 'lucide-react';

export default function Dashboard() {
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
        <div className="glass-card rounded-2xl p-6 border flex items-center gap-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl"></div>
          <div className="w-12 h-12 rounded-xl bg-cyan-950/20 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Activity className="w-6 h-6 animate-pulse glow-cyan" />
          </div>
          <div>
            <div className="text-xs text-cyan-400/80 uppercase font-bold tracking-widest mb-1">Estado del Sistema</div>
            <div className="text-2xl font-extrabold text-white mt-0.5">Optimo</div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 border flex items-center gap-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl"></div>
          <div className="w-12 h-12 rounded-xl bg-emerald-950/20 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 uppercase font-mono tracking-wider">Carga de Agentes</div>
            <div className="text-2xl font-extrabold text-slate-100 mt-0.5">14%</div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 border flex items-center gap-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/10 rounded-full blur-2xl"></div>
          <div className="w-12 h-12 rounded-xl bg-rose-950/20 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 uppercase font-mono tracking-wider">Alertas Activas</div>
            <div className="text-2xl font-extrabold text-slate-100 mt-0.5">0</div>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-12 border flex flex-col items-center justify-center text-center mt-8">
        <Activity className="w-16 h-16 text-slate-800 mb-4" />
        <h3 className="text-xl font-bold text-slate-300 mb-2">Próximamente</h3>
        <p className="text-slate-500 max-w-md">
          Aquí se integrarán métricas avanzadas, gráficos de rendimiento y resumen de la memoria global del OS.
        </p>
      </div>
    </div>
  );
}
