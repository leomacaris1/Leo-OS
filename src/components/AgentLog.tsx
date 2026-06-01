'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Play, Trash2, Filter, Cpu } from 'lucide-react';

interface LogEntry {
  timestamp: string;
  type: 'INFO' | 'SUCCESS' | 'WARN' | 'SYSTEM';
  message: string;
}

const PRESET_LOGS: LogEntry[] = [
  { timestamp: '02:00:15', type: 'SYSTEM', message: 'OmniAgent Core v1.0.4 initialized.' },
  { timestamp: '02:00:16', type: 'INFO', message: 'Establishing handshake with secure gateway...' },
  { timestamp: '02:00:18', type: 'SUCCESS', message: 'Supabase client connected. Auth tier: development.' },
  { timestamp: '02:00:20', type: 'INFO', message: 'Fetching metadata for system projects...' },
  { timestamp: '02:00:22', type: 'SUCCESS', message: 'Synchronized 4 active projects. LocalStorage mirror updated.' },
  { timestamp: '02:01:05', type: 'INFO', message: 'Checking subscription budget billing status...' },
  { timestamp: '02:01:06', type: 'SUCCESS', message: '5 subscriptions loaded. Current monthly overhead: $76.48.' },
  { timestamp: '02:02:40', type: 'WARN', message: 'Connection latency detected (250ms). Retrying API endpoints...' },
  { timestamp: '02:02:42', type: 'SUCCESS', message: 'Connection stabilized. Session integrity at 100%.' },
];

const SIMULATED_MESSAGES = [
  { type: 'INFO' as const, message: 'Scanning local workspace directory for new components...' },
  { type: 'SUCCESS' as const, message: 'Project "mmnexus-hub" integrity verification completed (100%).' },
  { type: 'SYSTEM' as const, message: 'Syncing cloud identities... 3 email accounts resolved.' },
  { type: 'INFO' as const, message: 'Recalculating digital footprint index...' },
  { type: 'SUCCESS' as const, message: 'Profiles for GitHub, LinkedIn and Twitter verified.' },
  { type: 'WARN' as const, message: 'No custom NEXT_PUBLIC_SUPABASE_URL detected. Local first fallback active.' },
  { type: 'SYSTEM' as const, message: 'Background cron job executed successfully. Session clean.' },
  { type: 'INFO' as const, message: 'OmniAgent is idle, listening for system triggers...' },
];

export default function AgentLog() {
  const [logs, setLogs] = useState<LogEntry[]>(PRESET_LOGS);
  const [filter, setFilter] = useState<'ALL' | 'INFO' | 'SUCCESS' | 'WARN' | 'SYSTEM'>('ALL');
  const [inputVal, setInputVal] = useState('');
  const [isSimulating, setIsSimulating] = useState(true);
  const logContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when logs update
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  // Simulate real-time logs appending
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      const randomMsg = SIMULATED_MESSAGES[Math.floor(Math.random() * SIMULATED_MESSAGES.length)];
      const now = new Date();
      const pad = (n: number) => String(n).padStart(2, '0');
      const timestamp = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
      
      setLogs(prev => [...prev, {
        timestamp,
        type: randomMsg.type,
        message: randomMsg.message
      }]);
    }, 8000);

    return () => clearInterval(interval);
  }, [isSimulating]);

  // Handle manual command execution
  const handleSendCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const cmd = inputVal.trim().toLowerCase();
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const timestamp = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

    // Add the user's input line
    const userLog: LogEntry = {
      timestamp,
      type: 'SYSTEM',
      message: `USR@LEO-OS:~$ ${inputVal}`
    };

    let responseLog: LogEntry;

    if (cmd === '/help') {
      responseLog = {
        timestamp,
        type: 'INFO',
        message: 'Comandos disponibles: /scan (Escaneo de integridad), /status (Estado de servicios), /sync (Forzar sincronización), /clear (Limpiar consola).'
      };
    } else if (cmd === '/scan') {
      responseLog = {
        timestamp,
        type: 'SUCCESS',
        message: 'Escaneo completo. 4 proyectos, 3 emails, 5 suscripciones. 0 vulnerabilidades.'
      };
    } else if (cmd === '/status') {
      responseLog = {
        timestamp,
        type: 'SUCCESS',
        message: 'Estado del Núcleo: EXCELENTE. Latencia: 12ms. Modo: Local Cache (Supabase inactivo).'
      };
    } else if (cmd === '/sync') {
      responseLog = {
        timestamp,
        type: 'SYSTEM',
        message: 'Forzando sincronización completa... [OK] Caché local sincronizado con éxito.'
      };
    } else if (cmd === '/clear') {
      setLogs([]);
      setInputVal('');
      return;
    } else {
      responseLog = {
        timestamp,
        type: 'WARN',
        message: `Comando no reconocido: "${inputVal}". Escribe /help para ver las opciones.`
      };
    }

    setLogs(prev => [...prev, userLog, responseLog]);
    setInputVal('');
  };

  // Filter logs
  const filteredLogs = logs.filter(log => {
    if (filter === 'ALL') return true;
    return log.type === filter;
  });

  const getLogTypeColor = (type: LogEntry['type']) => {
    switch (type) {
      case 'SYSTEM':
        return 'text-purple-400 font-bold';
      case 'SUCCESS':
        return 'text-emerald-400';
      case 'WARN':
        return 'text-amber-400';
      default:
        return 'text-cyan-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-100 flex items-center gap-2">
            <Terminal className="w-8 h-8 text-purple-400 glow-purple animate-pulse" />
            OmniAgent Terminal Log
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Visualizador interactivo de telemetría y ejecución en segundo plano de OmniAgent.
          </p>
        </div>

        {/* Action Toggle controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSimulating(!isSimulating)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-300 ${
              isSimulating 
                ? 'bg-emerald-950/20 text-emerald-400 border-emerald-500/30'
                : 'bg-slate-900 text-slate-400 border-slate-800'
            }`}
          >
            <Play className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin-slow' : ''}`} />
            {isSimulating ? 'Simulación Activa' : 'Simulación Pausada'}
          </button>

          <button
            onClick={() => setLogs([])}
            className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-950 border border-slate-800 text-slate-300 hover:text-rose-400 px-3 py-1.5 rounded-lg text-xs transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Limpiar
          </button>
        </div>
      </div>

      {/* Terminal View Container */}
      <div className="glass-panel border border-purple-500/20 rounded-2xl overflow-hidden shadow-[0_10px_40px_-15px_rgba(189,0,255,0.15)] flex flex-col h-[520px]">
        {/* Terminal Titlebar */}
        <div className="bg-slate-950/90 border-b border-slate-900 px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500/80"></span>
              <span className="w-3 h-3 rounded-full bg-amber-500/80"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-500/80"></span>
            </div>
            <span className="text-xs font-mono text-slate-500 ml-3">OMNIAGENT@LEO-OS: ~/telemetry</span>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as 'ALL' | 'INFO' | 'SUCCESS' | 'WARN' | 'SYSTEM')}
              title="Filtrar Logs"
              className="bg-slate-900 border border-slate-800 rounded px-2 py-0.5 text-xs text-slate-400 focus:outline-none"
            >
              <option value="ALL">TODOS</option>
              <option value="SYSTEM">SISTEMA</option>
              <option value="INFO">INFORMACIÓN</option>
              <option value="SUCCESS">ÉXITOS</option>
              <option value="WARN">ALERTAS</option>
            </select>
          </div>
        </div>

        {/* Logs terminal shell */}
        <div 
          ref={logContainerRef}
          className="flex-1 p-6 bg-slate-950/80 font-mono text-sm space-y-2 overflow-y-auto terminal-glow selection:bg-purple-500/30 select-text"
        >
          {filteredLogs.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-600 gap-2">
              <Cpu className="w-8 h-8 animate-pulse text-purple-600" />
              <span>Consola vacía. Esperando eventos de telemetría...</span>
            </div>
          ) : (
            filteredLogs.map((log, i) => (
              <div 
                key={i} 
                className={`leading-relaxed py-0.5 border-l-2 pl-3 transition-all duration-300 ${
                  log.message.startsWith('USR') 
                    ? 'border-cyan-500/30' 
                    : log.type === 'SUCCESS' 
                    ? 'border-emerald-500/30' 
                    : log.type === 'WARN' 
                    ? 'border-amber-500/30' 
                    : 'border-purple-500/30'
                }`}
              >
                <span className="text-slate-600 mr-2">[{log.timestamp}]</span>
                <span className={`text-xs uppercase font-bold mr-2 ${
                  log.type === 'SYSTEM' ? 'text-purple-400/80' : 
                  log.type === 'SUCCESS' ? 'text-emerald-500/80' : 
                  log.type === 'WARN' ? 'text-amber-500/80' : 'text-cyan-500/80'
                }`}>
                  {log.type}
                </span>
                <span className={getLogTypeColor(log.type)}>{log.message}</span>
              </div>
            ))
          )}
          {isSimulating && (
            <div className="text-purple-500/40 text-xs pl-3 select-none italic animate-pulse">
              -- OmniAgent está escuchando eventos activos --
            </div>
          )}
        </div>

        {/* Terminal Input Bar */}
        <form onSubmit={handleSendCommand} className="bg-slate-950/90 border-t border-slate-900 p-4 flex gap-3">
          <span className="text-purple-400 font-mono flex items-center shrink-0">leo-os@omni:~$</span>
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Introduce comando (ej: /help, /scan, /status)..."
            className="flex-1 bg-transparent text-cyan-400 font-mono text-sm outline-none focus:ring-0 border-none placeholder-slate-700"
          />
          <button
            type="submit"
            className="bg-purple-950/30 border border-purple-500/30 hover:border-purple-400/60 text-purple-400 px-4 py-1 rounded-lg text-xs font-mono transition-all duration-300"
          >
            EJECUTAR
          </button>
        </form>
      </div>
    </div>
  );
}
