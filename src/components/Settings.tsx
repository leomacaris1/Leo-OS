'use client';

import React from 'react';
import { Settings as SettingsIcon, Sliders } from 'lucide-react';

export default function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-100 flex items-center gap-2">
          <SettingsIcon className="w-8 h-8 text-cyan-400 glow-cyan" />
          Configuración
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          Ajustes globales del sistema y preferencias de usuario.
        </p>
      </div>

      <div className="glass-card rounded-2xl p-12 border flex flex-col items-center justify-center text-center mt-8">
        <Sliders className="w-16 h-16 text-slate-800 mb-4" />
        <h3 className="text-xl font-bold text-slate-300 mb-2">Módulo en Construcción</h3>
        <p className="text-slate-500 max-w-md">
          Próximamente podrás configurar temas, atajos de teclado, y conexiones a APIs de terceros.
        </p>
      </div>
    </div>
  );
}
