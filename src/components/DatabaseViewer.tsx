import React, { useState, useEffect } from 'react';
import { dbService } from '../lib/supabase';
import { Database, TableProperties, RefreshCw, Layers } from 'lucide-react';

type TableName = 
  | 'projects' 
  | 'agents' 
  | 'emails' 
  | 'social_profiles' 
  | 'subscriptions' 
  | 'agent_logs' 
  | 'notifications';

const TABLE_OPTIONS: { id: TableName; label: string }[] = [
  { id: 'projects', label: 'Projects' },
  { id: 'agents', label: 'Agents' },
  { id: 'subscriptions', label: 'Subscriptions' },
  { id: 'emails', label: 'Email Accounts' },
  { id: 'social_profiles', label: 'Social Profiles' },
  { id: 'agent_logs', label: 'Agent Logs' },
  { id: 'notifications', label: 'Notifications' },
];

export default function DatabaseViewer() {
  const [activeTable, setActiveTable] = useState<TableName>('projects');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTableData = async (table: TableName) => {
    setLoading(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let result: any[] = [];
      switch (table) {
        case 'projects': result = await dbService.getProjects(); break;
        case 'agents': result = await dbService.getAgents(); break;
        case 'emails': result = await dbService.getEmails(); break;
        case 'social_profiles': result = await dbService.getSocials(); break;
        case 'subscriptions': result = await dbService.getSubscriptions(); break;
        case 'agent_logs': result = await dbService.getAgentLogs(); break;
        case 'notifications': result = await dbService.getNotifications(); break;
      }
      setData(result);
    } catch (error) {
      console.error(`Error fetching data for ${table}:`, error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTableData(activeTable);
  }, [activeTable]);

  const handleRefresh = () => {
    fetchTableData(activeTable);
  };

  // Derive columns from the first row of data, if available.
  const columns = data.length > 0 ? Object.keys(data[0]) : [];

  return (
    <div className="flex h-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl relative z-10">
      
      {/* Sidebar - Tables List */}
      <div className="w-64 border-r border-slate-800 bg-slate-950/50 flex flex-col shrink-0">
        <div className="p-4 border-b border-slate-800">
          <div className="flex items-center gap-2 mb-1">
            <Database className="w-5 h-5 text-fuchsia-400" />
            <h2 className="text-lg font-bold text-slate-200">Data Store</h2>
          </div>
          <p className="text-xs text-slate-500">Visualizador de tablas (Solo lectura)</p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-3">
          <div className="text-[10px] font-mono tracking-widest text-slate-500 uppercase px-2 mb-3">
            Tablas del Sistema
          </div>
          <ul className="space-y-1">
            {TABLE_OPTIONS.map(table => (
              <li key={table.id}>
                <button
                  onClick={() => setActiveTable(table.id)}
                  className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-all ${
                    activeTable === table.id 
                      ? 'bg-fuchsia-500/10 border border-fuchsia-500/30 text-fuchsia-400' 
                      : 'border border-transparent hover:bg-slate-800/50 hover:border-slate-700/50 text-slate-400'
                  }`}
                >
                  <TableProperties className={`w-4 h-4 ${activeTable === table.id ? 'text-fuchsia-400' : 'text-slate-500'}`} />
                  <span className="text-sm font-medium">{table.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Main Data Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#0a0e1a]">
        
        {/* Header */}
        <div className="h-16 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-900/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-fuchsia-500/10 rounded-lg text-fuchsia-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-slate-200 font-bold leading-tight font-mono">{activeTable}</h3>
              <div className="text-xs text-slate-500">
                {data.length} {data.length === 1 ? 'registro' : 'registros'}
              </div>
            </div>
          </div>
          
          <button 
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-slate-200 bg-slate-800/50 hover:bg-slate-800 px-3 py-1.5 rounded-full transition-colors border border-slate-700/50 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> 
            {loading ? 'Sincronizando...' : 'Refrescar'}
          </button>
        </div>

        {/* Data Grid */}
        <div className="flex-1 overflow-auto p-4">
          {loading && data.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500">
              <RefreshCw className="w-8 h-8 mb-4 animate-spin opacity-50" />
              <p className="text-sm">Cargando registros...</p>
            </div>
          ) : data.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500">
              <Database className="w-12 h-12 mb-4 opacity-20" />
              <p className="text-lg font-medium text-slate-400">Tabla vacía</p>
              <p className="text-sm text-slate-600 mt-1">No hay registros en la tabla {activeTable}.</p>
            </div>
          ) : (
            <div className="bg-slate-950/80 rounded-xl border border-slate-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm whitespace-nowrap">
                  <thead className="bg-slate-900/80 border-b border-slate-800">
                    <tr>
                      {columns.map(col => (
                        <th key={col} className="p-3 font-mono text-xs font-semibold text-slate-400 tracking-wider">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {data.map((row: any, idx) => (
                      <tr key={row.id || idx} className="hover:bg-slate-900/50 transition-colors">
                        {columns.map(col => {
                          const val = row[col as keyof typeof row];
                          let displayVal = val;
                          
                          if (val === null) displayVal = <span className="text-slate-600 italic">null</span>;
                          else if (val === undefined) displayVal = <span className="text-slate-600 italic">undefined</span>;
                          else if (typeof val === 'boolean') displayVal = <span className={val ? 'text-emerald-400' : 'text-rose-400'}>{val ? 'true' : 'false'}</span>;
                          else if (typeof val === 'object') displayVal = <span className="text-cyan-400">{JSON.stringify(val)}</span>;
                          else if (typeof val === 'string' && val.length > 60) displayVal = <span title={val}>{val.substring(0, 60)}...</span>;
                          
                          return (
                            <td key={`${row.id || idx}-${col}`} className="p-3 text-slate-300 max-w-xs truncate">
                              {displayVal}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
