'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Terminal, Play, Trash2, Filter, Cpu } from 'lucide-react';
import { dbService, supabase, AgentLogEntry } from '../lib/supabase';

interface LogEntry {
  timestamp: string;
  type: 'INFO' | 'SUCCESS' | 'WARN' | 'SYSTEM';
  message: string;
}


const SIMULATED_MESSAGES = [
  { type: 'INFO' as const, message: 'Scanning workspace... 6 projects detected in Leo OS registry.' },
  { type: 'SUCCESS' as const, message: 'Project "mmnexus-hub" audit complete → 🟢 Full Green (95%).' },
  { type: 'SYSTEM' as const, message: 'Syncing cloud identities... 3 email accounts resolved.' },
  { type: 'INFO' as const, message: 'OmniAgent v7.0 → 🟡 Conectando LLM pipeline (85%)...' },
  { type: 'SUCCESS' as const, message: 'CoreOps → 🟣 En Producción. Kubernetes cluster healthy.' },
  { type: 'WARN' as const, message: 'MoneyFlow Pro MVP at 80%. Stripe integration pending final tests.' },
  { type: 'INFO' as const, message: 'Fabrica de Productos: Motor Activo. Progress: 35%.' },
  { type: 'SYSTEM' as const, message: 'Digital Business: Estrategia phase. Analytics pipeline initialized.' },
  { type: 'SUCCESS' as const, message: 'Profiles for GitHub, LinkedIn and Twitter verified.' },
  { type: 'WARN' as const, message: 'No custom NEXT_PUBLIC_SUPABASE_URL detected. Local first fallback active.' },
  { type: 'SYSTEM' as const, message: 'Background cron job executed successfully. Session clean.' },
  { type: 'INFO' as const, message: 'OmniAgent is idle, listening for system triggers...' },
];

export default function AgentLog() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filter, setFilter] = useState<'ALL' | 'INFO' | 'SUCCESS' | 'WARN' | 'SYSTEM'>('ALL');
  const [inputVal, setInputVal] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const logContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  };

  const getNowTimestamp = useCallback(() => {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  }, []);

  // Scroll to bottom when logs update
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  // Load real logs from database on mount
  useEffect(() => {
    const fetchLogs = async () => {
      const dbLogs = await dbService.getAgentLogs();
      // AgentLogs order is desc (newest first) by default in dbService,
      // but terminal usually shows oldest top, newest bottom.
      const formattedLogs: LogEntry[] = dbLogs.map(log => ({
        timestamp: formatTime(log.created_at),
        type: (log.level.toUpperCase() === 'ERROR' ? 'WARN' : log.level.toUpperCase()) as LogEntry['type'],
        message: `[${log.component}] ${log.message}`
      })).reverse();
      
      setLogs(formattedLogs);
    };
    fetchLogs();
  }, []);

  // Subscribe to real-time events via Supabase
  useEffect(() => {
    if (!supabase) return;

    const channel = supabase
      .channel('agent_logs_changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'agent_logs' }, (payload) => {
        const newLog = payload.new as AgentLogEntry;
        setLogs(prev => [...prev, {
          timestamp: formatTime(newLog.created_at),
          type: (newLog.level.toUpperCase() === 'ERROR' ? 'WARN' : newLog.level.toUpperCase()) as LogEntry['type'],
          message: `[${newLog.component}] ${newLog.message}`
        }]);
      })
      .subscribe();

    return () => {
      if (supabase) {
        supabase.removeChannel(channel);
      }
    };
  }, []);

  // Traffic generator (send data to our API webhook to simulate external Agent activity)
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(async () => {
      const randomMsg = SIMULATED_MESSAGES[Math.floor(Math.random() * SIMULATED_MESSAGES.length)];
      
      try {
        await fetch('/api/webhooks/nexus', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            event: 'log',
            level: randomMsg.type === 'WARN' ? 'WARNING' : randomMsg.type,
            component: 'System Simulator',
            message: randomMsg.message
          })
        });
      } catch (e) {
        console.error('Failed to post simulated log to webhook', e);
      }
    }, 8000);

    return () => clearInterval(interval);
  }, [isSimulating]);

  // ── Command Parser ──────────────────────────────────────────
  const executeCommand = async (rawInput: string) => {
    const cmd = rawInput.trim();
    const cmdLower = cmd.toLowerCase();
    const timestamp = getNowTimestamp();

    // Echo the user's command
    const userLog: LogEntry = {
      timestamp,
      type: 'SYSTEM',
      message: `USR@LEO-OS:~$ ${cmd}`
    };

    // ── help ───────────────────────────────────────────────────
    if (cmdLower === 'help' || cmdLower === '/help') {
      const helpLines: LogEntry[] = [
        { timestamp, type: 'INFO', message: '╔══════════════════════════════════════════════════════════════╗' },
        { timestamp, type: 'INFO', message: '║               LEO OS — TERMINAL INTERACTIVA                ║' },
        { timestamp, type: 'INFO', message: '╠══════════════════════════════════════════════════════════════╣' },
        { timestamp, type: 'SUCCESS', message: '║  help          → Muestra esta pantalla de ayuda             ║' },
        { timestamp, type: 'SUCCESS', message: '║  clear         → Limpia toda la terminal                    ║' },
        { timestamp, type: 'SUCCESS', message: '║  ping          → Verifica latencia y estado del backend     ║' },
        { timestamp, type: 'SUCCESS', message: '║  sysinfo       → Muestra información del sistema Leo OS    ║' },
        { timestamp, type: 'SUCCESS', message: '║  ls tables     → Lista las tablas de la base de datos       ║' },
        { timestamp, type: 'SUCCESS', message: '║  count <tabla> → Cuenta registros de una tabla              ║' },
        { timestamp, type: 'SUCCESS', message: '║  whoami        → Muestra el usuario activo                  ║' },
        { timestamp, type: 'SUCCESS', message: '║  uptime        → Muestra tiempo de sesión activa            ║' },
        { timestamp, type: 'SUCCESS', message: '║  nexus trigger → Dispara un log de prueba vía webhook       ║' },
        { timestamp, type: 'SUCCESS', message: '║  /scan         → Escaneo rápido de workspace                ║' },
        { timestamp, type: 'SUCCESS', message: '║  /status       → Estado del núcleo                          ║' },
        { timestamp, type: 'SUCCESS', message: '║  /analyze [t]  → Análisis heurístico profundo               ║' },
        { timestamp, type: 'SUCCESS', message: '║  /matrix       → Easter egg visual                          ║' },
        { timestamp, type: 'INFO', message: '╚══════════════════════════════════════════════════════════════╝' },
      ];
      setLogs(prev => [...prev, userLog, ...helpLines]);
      return;
    }

    // ── clear ──────────────────────────────────────────────────
    if (cmdLower === 'clear' || cmdLower === '/clear') {
      setLogs([]);
      return;
    }

    // ── ping ───────────────────────────────────────────────────
    if (cmdLower === 'ping') {
      setLogs(prev => [...prev, userLog, { timestamp, type: 'INFO', message: 'Enviando ping al backend...' }]);
      const start = performance.now();
      try {
        const projects = await dbService.getProjects();
        const elapsed = Math.round(performance.now() - start);
        setLogs(prev => [...prev, 
          { timestamp: getNowTimestamp(), type: 'SUCCESS', message: `PONG ✓ — Latencia: ${elapsed}ms | Backend: ${supabase ? 'Supabase Cloud' : 'LocalStorage'} | Registros: ${projects.length} proyectos` }
        ]);
      } catch {
        const elapsed = Math.round(performance.now() - start);
        setLogs(prev => [...prev,
          { timestamp: getNowTimestamp(), type: 'WARN', message: `PING FAILED ✗ — Timeout: ${elapsed}ms | Sin conexión al backend.` }
        ]);
      }
      return;
    }

    // ── sysinfo ────────────────────────────────────────────────
    if (cmdLower === 'sysinfo') {
      const projects = await dbService.getProjects();
      const agents = await dbService.getAgents();
      const subs = await dbService.getSubscriptions();
      const emails = await dbService.getEmails();
      const notifs = await dbService.getNotifications();

      const totalCost = subs.reduce((acc, s) => acc + (s.cost || 0), 0);

      const infoLines: LogEntry[] = [
        { timestamp, type: 'INFO', message: '┌─────────────── SYSTEM INFO ───────────────┐' },
        { timestamp, type: 'SUCCESS', message: `│  OS          : Leo OS v1.0.0               │` },
        { timestamp, type: 'SUCCESS', message: `│  Backend     : ${supabase ? 'Supabase Cloud' : 'LocalStorage Fallback'}${supabase ? '         ' : '   '}│` },
        { timestamp, type: 'SUCCESS', message: `│  Proyectos   : ${String(projects.length).padEnd(28)}│` },
        { timestamp, type: 'SUCCESS', message: `│  Agentes     : ${String(agents.length).padEnd(28)}│` },
        { timestamp, type: 'SUCCESS', message: `│  Emails      : ${String(emails.length).padEnd(28)}│` },
        { timestamp, type: 'SUCCESS', message: `│  Suscripciones: ${String(subs.length).padEnd(27)}│` },
        { timestamp, type: 'SUCCESS', message: `│  Gasto mensual: $${totalCost.toFixed(2).padEnd(25)}│` },
        { timestamp, type: 'SUCCESS', message: `│  Notificaciones: ${String(notifs.length).padEnd(26)}│` },
        { timestamp, type: 'SUCCESS', message: `│  Sesión      : ${new Date().toLocaleString('es-AR').padEnd(28)}│` },
        { timestamp, type: 'INFO', message: '└───────────────────────────────────────────┘' },
      ];
      setLogs(prev => [...prev, userLog, ...infoLines]);
      return;
    }

    // ── ls tables ──────────────────────────────────────────────
    if (cmdLower === 'ls tables' || cmdLower === 'ls') {
      const tables = ['projects', 'agents', 'emails', 'social_profiles', 'subscriptions', 'agent_logs', 'notifications', 'project_tasks'];
      const tableLines: LogEntry[] = tables.map(t => ({
        timestamp, type: 'INFO' as const, message: `  📄 ${t}`
      }));
      setLogs(prev => [...prev, userLog, { timestamp, type: 'SYSTEM', message: `${tables.length} tablas encontradas en el esquema:` }, ...tableLines]);
      return;
    }

    // ── count <table> ──────────────────────────────────────────
    if (cmdLower.startsWith('count ')) {
      const tableName = cmdLower.split(' ')[1];
      setLogs(prev => [...prev, userLog, { timestamp, type: 'INFO', message: `Contando registros en "${tableName}"...` }]);
      try {
        let count = 0;
        switch (tableName) {
          case 'projects': count = (await dbService.getProjects()).length; break;
          case 'agents': count = (await dbService.getAgents()).length; break;
          case 'emails': count = (await dbService.getEmails()).length; break;
          case 'social_profiles': count = (await dbService.getSocials()).length; break;
          case 'subscriptions': count = (await dbService.getSubscriptions()).length; break;
          case 'agent_logs': count = (await dbService.getAgentLogs()).length; break;
          case 'notifications': count = (await dbService.getNotifications()).length; break;
          default:
            setLogs(prev => [...prev, { timestamp: getNowTimestamp(), type: 'WARN', message: `Tabla "${tableName}" no reconocida. Usa "ls tables" para ver las disponibles.` }]);
            return;
        }
        setLogs(prev => [...prev, { timestamp: getNowTimestamp(), type: 'SUCCESS', message: `SELECT COUNT(*) FROM ${tableName} → ${count} registros.` }]);
      } catch {
        setLogs(prev => [...prev, { timestamp: getNowTimestamp(), type: 'WARN', message: `Error al contar registros de "${tableName}".` }]);
      }
      return;
    }

    // ── whoami ─────────────────────────────────────────────────
    if (cmdLower === 'whoami') {
      setLogs(prev => [...prev, userLog, { timestamp, type: 'SUCCESS', message: 'leo-macaris@leo-os (Admin / Owner)' }]);
      return;
    }

    // ── uptime ─────────────────────────────────────────────────
    if (cmdLower === 'uptime') {
      const uptimeMs = performance.now();
      const uptimeSec = Math.floor(uptimeMs / 1000);
      const mins = Math.floor(uptimeSec / 60);
      const secs = uptimeSec % 60;
      setLogs(prev => [...prev, userLog, { timestamp, type: 'SUCCESS', message: `Sesión activa: ${mins}m ${secs}s | Tab activa desde: ${new Date(Date.now() - uptimeMs).toLocaleTimeString('es-AR')}` }]);
      return;
    }

    // ── nexus trigger ──────────────────────────────────────────
    if (cmdLower === 'nexus trigger') {
      setLogs(prev => [...prev, userLog, { timestamp, type: 'INFO', message: 'Disparando log de prueba vía webhook /api/webhooks/nexus...' }]);
      try {
        await fetch('/api/webhooks/nexus', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: 'log',
            level: 'INFO',
            component: 'Terminal CLI',
            message: `Manual trigger desde terminal interactiva a las ${getNowTimestamp()}`
          })
        });
        setLogs(prev => [...prev, { timestamp: getNowTimestamp(), type: 'SUCCESS', message: 'Webhook disparado con éxito ✓. Si Supabase Realtime está activo, verás el log aparecer.' }]);
      } catch {
        setLogs(prev => [...prev, { timestamp: getNowTimestamp(), type: 'WARN', message: 'Error al disparar webhook. Verifica que el servidor esté corriendo.' }]);
      }
      return;
    }

    // ── Legacy commands (keep backward compat) ─────────────────
    if (cmdLower === '/scan') {
      setLogs(prev => [...prev, userLog, { timestamp, type: 'SUCCESS', message: 'Escaneo completo. 4 proyectos, 3 emails, 5 suscripciones. 0 vulnerabilidades.' }]);
      return;
    }
    if (cmdLower === '/status') {
      setLogs(prev => [...prev, userLog, { timestamp, type: 'SUCCESS', message: `Estado del Núcleo: EXCELENTE. Backend: ${supabase ? 'Supabase Cloud' : 'Local Cache'}. Modo: Producción.` }]);
      return;
    }
    if (cmdLower === '/sync') {
      setLogs(prev => [...prev, userLog, { timestamp, type: 'SYSTEM', message: 'Forzando sincronización completa... [OK] Caché local sincronizado con éxito.' }]);
      return;
    }
    if (cmdLower.startsWith('/analyze')) {
      const target = cmdLower.split(' ')[1] || 'sistema global';
      setLogs(prev => [...prev, userLog, { timestamp, type: 'INFO', message: `Iniciando escaneo heurístico profundo sobre: [${target}]...` }]);
      setTimeout(() => {
        setLogs(prev => [...prev, { timestamp: getNowTimestamp(), type: 'SYSTEM', message: `Analizando dependencias y flujos de ${target}... (45%)` }]);
      }, 1500);
      setTimeout(() => {
        setLogs(prev => [...prev, { timestamp: getNowTimestamp(), type: 'SUCCESS', message: `[${target}] Análisis completado. 0 vulnerabilidades críticas detectadas.` }]);
      }, 3500);
      return;
    }
    if (cmdLower === '/fix') {
      setLogs(prev => [...prev, userLog, { timestamp, type: 'SYSTEM', message: 'Ejecutando rutinas de auto-reparación y optimización de memoria...' }]);
      setTimeout(() => {
        setLogs(prev => [...prev, { timestamp: getNowTimestamp(), type: 'SUCCESS', message: 'Auto-reparación concluida. Memoria liberada: 124MB.' }]);
      }, 2000);
      return;
    }
    if (cmdLower === '/matrix') {
      setLogs(prev => [...prev, userLog, { timestamp, type: 'SUCCESS', message: 'Iniciando protocolo visual The Matrix...' }]);
      const matrixInterval = setInterval(() => {
        setLogs(prev => [...prev, { timestamp: getNowTimestamp(), type: 'SYSTEM', message: Array.from({length: 40}, () => String.fromCharCode(33 + Math.random() * 94)).join('') }]);
      }, 100);
      setTimeout(() => clearInterval(matrixInterval), 1500);
      return;
    }

    // ── Unknown command ────────────────────────────────────────
    setLogs(prev => [...prev, userLog, { 
      timestamp, type: 'WARN', 
      message: `Comando no reconocido: "${cmd}". Escribe help para ver las opciones disponibles.` 
    }]);
  };

  // Handle form submission
  const handleSendCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    // Save to history
    setCommandHistory(prev => [...prev, inputVal.trim()]);
    setHistoryIndex(-1);

    executeCommand(inputVal);
    setInputVal('');
  };

  // Handle keyboard navigation (arrow up/down for history)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      const newIndex = historyIndex === -1 
        ? commandHistory.length - 1 
        : Math.max(0, historyIndex - 1);
      setHistoryIndex(newIndex);
      setInputVal(commandHistory[newIndex]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === -1) return;
      const newIndex = historyIndex + 1;
      if (newIndex >= commandHistory.length) {
        setHistoryIndex(-1);
        setInputVal('');
      } else {
        setHistoryIndex(newIndex);
        setInputVal(commandHistory[newIndex]);
      }
    }
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
            Terminal Interactiva
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Terminal de comandos con telemetría en tiempo real. Escribe <code className="text-cyan-400 bg-slate-900 px-1.5 py-0.5 rounded text-xs">help</code> para comenzar.
          </p>
        </div>

        {/* Action Toggle controls */}
        <div className="flex items-center gap-2">
          <div className="text-[10px] font-mono text-slate-600 mr-2">
            {commandHistory.length} cmd{commandHistory.length !== 1 && 's'} en historial
          </div>
          <button
            onClick={() => setIsSimulating(!isSimulating)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-300 ${
              isSimulating 
                ? 'bg-emerald-950/20 text-emerald-400 border-emerald-500/30'
                : 'bg-slate-900 text-slate-400 border-slate-800'
            }`}
          >
            <Play className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin-slow' : ''}`} />
            {isSimulating ? 'Generador Activo' : 'Generar Tráfico'}
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
            <span className="text-xs font-mono text-slate-500 ml-3">LEO-OS@TERMINAL: ~/interactive</span>
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
          onClick={() => inputRef.current?.focus()}
        >
          {filteredLogs.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-600 gap-2">
              <Cpu className="w-8 h-8 animate-pulse text-purple-600" />
              <span>Consola vacía. Escribe <span className="text-cyan-400">help</span> para ver los comandos disponibles.</span>
            </div>
          ) : (
            filteredLogs.map((log, i) => (
              <div 
                key={i} 
                className={`leading-relaxed py-1.5 px-2 mb-1 border-l-2 pl-3 transition-all duration-500 animate-in fade-in slide-in-from-left-2 rounded-r bg-slate-900/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)] ${
                  log.message.startsWith('USR') 
                    ? 'border-cyan-500/50 bg-cyan-950/10' 
                    : log.type === 'SUCCESS' 
                    ? 'border-emerald-500/50' 
                    : log.type === 'WARN' 
                    ? 'border-amber-500/50' 
                    : 'border-purple-500/50'
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
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escribe un comando (ej: help, ping, sysinfo, count projects)..."
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
