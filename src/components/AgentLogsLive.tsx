'use client';

import React, { useState, useEffect } from 'react';
import { dbService, AgentLogEntry } from '../lib/supabase';
import { 
  Terminal, 
  RefreshCw, 
  Trash2, 
  Database, 
  AlertCircle, 
  CheckCircle, 
  Info,
  ServerCrash
} from 'lucide-react';

export default function AgentLogsLive() {
  const [logs, setLogs] = useState<AgentLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const data = await dbService.getAgentLogs();
      setLogs(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching agent logs:', err);
      setError('Error al obtener logs de Supabase. Revisa tu conexión.');
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      fetchLogs(true);
    }, 5000);
    return () => clearInterval(interval);
  }, [autoRefresh]);

  const handleClearLogs = async () => {
    if (!window.confirm('¿Estás seguro de que deseas vaciar todos los registros del agente?')) return;
    try {
      const ok = await dbService.clearAgentLogs();
      if (ok) {
        setLogs([]);
      }
    } catch (err) {
      console.error(err);
      alert('Error al limpiar registros.');
    }
  };

  const getLevelBadge = (level: string) => {
    const lvl = level.toUpperCase();
    switch (lvl) {
      case 'ERROR':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-red-500/30 bg-red-950/20 text-red-400 text-xs font-semibold tracking-wider font-mono">
            <ServerCrash className="w-3.5 h-3.5" />
            ERROR
          </span>
        );
      case 'SUCCESS':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-emerald-500/30 bg-emerald-950/20 text-emerald-400 text-xs font-semibold tracking-wider font-mono">
            <CheckCircle className="w-3.5 h-3.5 animate-pulse" />
            SUCCESS
          </span>
        );
      case 'WARNING':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-amber-500/30 bg-amber-950/20 text-amber-400 text-xs font-semibold tracking-wider font-mono">
            <AlertCircle className="w-3.5 h-3.5" />
            WARNING
          </span>
        );
      default: // INFO
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-cyan-500/30 bg-cyan-950/20 text-cyan-400 text-xs font-semibold tracking-wider font-mono">
            <Info className="w-3.5 h-3.5" />
            INFO
          </span>
        );
    }
  };

  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    } catch {
      return '--:--:--';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 glass-panel border border-slate-800/50 rounded-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full filter blur-3xl -translate-y-1/2 translate-x-1/3 -z-10"></div>
        
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Terminal className="w-6 h-6 glow-cyan" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-wide flex items-center gap-2">
              🤖 Agent Logs <span className="text-xs font-mono font-normal px-2 py-0.5 rounded border border-cyan-500/20 bg-cyan-500/5 text-cyan-400">REALTIME</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">Telemetría de operaciones en vivo conectada con OmniAgent</p>
          </div>
        </div>

        {/* Actions panel */}
        <div className="flex items-center gap-3">
          {/* Auto Refresh toggle */}
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-medium tracking-wide transition-all duration-300 ${
              autoRefresh
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${autoRefresh ? 'bg-emerald-400 pulse-emerald' : 'bg-slate-600'}`}></span>
            {autoRefresh ? 'Auto 5s ON' : 'Auto Refresh OFF'}
          </button>

          {/* Refresh Manual */}
          <button
            onClick={() => fetchLogs()}
            disabled={loading}
            className="flex items-center justify-center p-2.5 rounded-xl border border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 transition-all duration-300 disabled:opacity-50"
            title="Refrescar logs ahora"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
          </button>

          {/* Clear Logs */}
          <button
            onClick={handleClearLogs}
            disabled={logs.length === 0}
            className="flex items-center justify-center p-2.5 rounded-xl border border-red-500/20 bg-red-950/10 text-red-400 hover:text-red-300 hover:bg-red-950/20 transition-all duration-300 disabled:opacity-40"
            title="Vaciar tabla de logs"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Table Content */}
      <div className="glass-panel border border-slate-800/50 rounded-2xl overflow-hidden relative">
        {error && (
          <div className="p-4 mx-6 mt-6 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-400 text-xs font-mono">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {loading && logs.length === 0 ? (
          <div className="py-24 text-center">
            <div className="relative w-12 h-12 mx-auto mb-4">
              <span className="absolute inset-0 rounded-full border-4 border-cyan-500/10 border-t-cyan-400 animate-spin"></span>
            </div>
            <p className="text-sm font-mono text-cyan-400/80 tracking-wider">ESCUCHANDO TELEMETRÍA...</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="py-24 text-center">
            <Terminal className="w-12 h-12 text-slate-600 mx-auto mb-3 animate-pulse" />
            <p className="text-sm text-slate-500 font-mono">No hay registros de actividad del agente.</p>
            <p className="text-xs text-slate-600 font-mono mt-1">Conecta OmniAgent y ejecuta tareas para ver logs en vivo.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800/60 bg-slate-900/20 text-[10px] uppercase font-mono tracking-widest text-slate-500">
                  <th className="py-4 px-6">Hora</th>
                  <th className="py-4 px-6">Nivel</th>
                  <th className="py-4 px-6">Componente</th>
                  <th className="py-4 px-6">Mensaje</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/30">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-900/10 transition-colors duration-200">
                    {/* Timestamp */}
                    <td className="py-4 px-6 whitespace-nowrap text-xs font-mono text-slate-400">
                      {formatTime(log.created_at)}
                    </td>

                    {/* Level */}
                    <td className="py-4 px-6 whitespace-nowrap">
                      {getLevelBadge(log.level)}
                    </td>

                    {/* Component */}
                    <td className="py-4 px-6 whitespace-nowrap">
                      <span className="text-xs font-semibold font-mono text-slate-300 bg-slate-900/60 px-2 py-0.5 rounded border border-slate-800/80">
                        {log.component}
                      </span>
                    </td>

                    {/* Message */}
                    <td className="py-4 px-6 text-sm font-mono text-slate-300 min-w-[300px]">
                      <div className="max-h-20 overflow-y-auto whitespace-pre-wrap break-all leading-relaxed scrollbar-thin">
                        {log.message}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Stats Footer bar */}
        <div className="p-4 bg-slate-900/10 border-t border-slate-800/40 flex items-center justify-between text-[10px] font-mono text-slate-500 px-6">
          <div className="flex items-center gap-2">
            <Database className="w-3.5 h-3.5 text-cyan-500 animate-pulse" />
            <span>Base de datos activa: agent_logs</span>
          </div>
          <div>
            <span>Total registros: {logs.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
