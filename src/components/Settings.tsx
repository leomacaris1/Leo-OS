'use client';

import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Palette, Zap, Database, Check } from 'lucide-react';
import { supabase } from '../lib/supabase';

type ThemeType = 'cyberpunk' | 'matrix' | 'crimson';

export default function Settings() {
  const [theme, setTheme] = useState<ThemeType>('cyberpunk');
  const [performanceMode, setPerformanceMode] = useState<'standard' | 'high'>('standard');
  const [isCloud, setIsCloud] = useState<boolean>(false);

  // Initialize from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('leo-os-theme') as ThemeType;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
    
    const savedPerf = localStorage.getItem('leo-os-performance');
    if (savedPerf === 'high') {
      setPerformanceMode('high');
      document.documentElement.setAttribute('data-performance', 'high');
    }

    setIsCloud(!!supabase);
  }, []);

  const handleThemeChange = (newTheme: ThemeType) => {
    setTheme(newTheme);
    localStorage.setItem('leo-os-theme', newTheme);
    if (newTheme === 'cyberpunk') {
      document.documentElement.removeAttribute('data-theme'); // default
    } else {
      document.documentElement.setAttribute('data-theme', newTheme);
    }
  };

  const handlePerformanceChange = (mode: 'standard' | 'high') => {
    setPerformanceMode(mode);
    localStorage.setItem('leo-os-performance', mode);
    if (mode === 'high') {
      document.documentElement.setAttribute('data-performance', 'high');
    } else {
      document.documentElement.removeAttribute('data-performance');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-100 flex items-center gap-2">
          <SettingsIcon className="w-8 h-8 text-cyan-400 glow-cyan" />
          Configuración del Sistema
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          Ajustes globales de interfaz, rendimiento y conexiones.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {/* Appearance Settings */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800/60">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <Palette className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-200">Apariencia y Temas</h3>
          </div>
          
          <div className="space-y-4">
            {/* Cyberpunk */}
            <button 
              onClick={() => handleThemeChange('cyberpunk')}
              className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all duration-300 ${theme === 'cyberpunk' ? 'bg-purple-950/20 border-purple-500/50 glow-purple' : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'}`}
            >
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  <span className="w-3 h-3 rounded-full bg-[#00f0ff]"></span>
                  <span className="w-3 h-3 rounded-full bg-[#bd00ff]"></span>
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-slate-200">Cyberpunk Neon</p>
                  <p className="text-xs text-slate-500">Paleta original oscuro/morado</p>
                </div>
              </div>
              {theme === 'cyberpunk' && <Check className="w-4 h-4 text-purple-400" />}
            </button>

            {/* Matrix */}
            <button 
              onClick={() => handleThemeChange('matrix')}
              className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all duration-300 ${theme === 'matrix' ? 'bg-emerald-950/20 border-emerald-500/50 glow-emerald' : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'}`}
            >
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  <span className="w-3 h-3 rounded-full bg-[#00ff41]"></span>
                  <span className="w-3 h-3 rounded-full bg-[#008f11]"></span>
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-slate-200">Emerald Matrix</p>
                  <p className="text-xs text-slate-500">Estética terminal verde clásica</p>
                </div>
              </div>
              {theme === 'matrix' && <Check className="w-4 h-4 text-emerald-400" />}
            </button>

            {/* Crimson */}
            <button 
              onClick={() => handleThemeChange('crimson')}
              className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all duration-300 ${theme === 'crimson' ? 'bg-rose-950/20 border-rose-500/50 glow-rose' : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'}`}
            >
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  <span className="w-3 h-3 rounded-full bg-[#ff0044]"></span>
                  <span className="w-3 h-3 rounded-full bg-[#ff3b3b]"></span>
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-slate-200">Crimson Alert</p>
                  <p className="text-xs text-slate-500">Tonos rojos de alta prioridad</p>
                </div>
              </div>
              {theme === 'crimson' && <Check className="w-4 h-4 text-rose-400" />}
            </button>
          </div>
        </div>

        {/* System & Performance Settings */}
        <div className="space-y-6">
          {/* Performance */}
          <div className="glass-card rounded-2xl p-6 border border-slate-800/60">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-amber-500/10 rounded-lg">
                <Zap className="w-5 h-5 text-amber-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-200">Rendimiento Visual</h3>
            </div>
            
            <div className="space-y-4">
              <button 
                onClick={() => handlePerformanceChange('standard')}
                className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all duration-300 ${performanceMode === 'standard' ? 'bg-amber-950/20 border-amber-500/50 glow-amber' : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'}`}
              >
                <div className="text-left">
                  <p className="text-sm font-bold text-slate-200">Alta Fidelidad (Glassmorphism)</p>
                  <p className="text-xs text-slate-500">Activa desenfoques (Blur) intensivos</p>
                </div>
                {performanceMode === 'standard' && <Check className="w-4 h-4 text-amber-400" />}
              </button>

              <button 
                onClick={() => handlePerformanceChange('high')}
                className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all duration-300 ${performanceMode === 'high' ? 'bg-slate-800/50 border-slate-500/50' : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'}`}
              >
                <div className="text-left">
                  <p className="text-sm font-bold text-slate-200">Máximo Rendimiento</p>
                  <p className="text-xs text-slate-500">Desactiva efectos de cristal, ideal para portátiles</p>
                </div>
                {performanceMode === 'high' && <Check className="w-4 h-4 text-slate-400" />}
              </button>
            </div>
          </div>

          {/* Connection Mode */}
          <div className="glass-card rounded-2xl p-6 border border-slate-800/60">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-cyan-500/10 rounded-lg">
                <Database className="w-5 h-5 text-cyan-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-200">Conexión de Datos</h3>
            </div>
            
            <div className={`p-4 rounded-xl border ${isCloud ? 'bg-emerald-950/20 border-emerald-500/30' : 'bg-amber-950/20 border-amber-500/30'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-200">Modo de Operación</p>
                  <p className="text-xs text-slate-400 mt-1">
                    {isCloud 
                      ? "Conectado a Supabase Cloud en tiempo real." 
                      : "Operando en LocalStorage Cache. Variables de Supabase no detectadas."}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`relative flex h-3 w-3`}>
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isCloud ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
                    <span className={`relative inline-flex rounded-full h-3 w-3 ${isCloud ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                  </span>
                  <span className={`text-xs font-bold uppercase ${isCloud ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {isCloud ? 'CLOUD ACTIVE' : 'LOCAL CACHE'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
