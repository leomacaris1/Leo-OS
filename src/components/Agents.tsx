'use client';

import React, { useState, useEffect } from 'react';
import { Bot, Plus, Cpu, X, Zap, Loader2, Save } from 'lucide-react';
import { dbService, Agent } from '../lib/supabase';

const AVAILABLE_SKILLS = [
  { id: 'web_search', label: 'Búsqueda Web', icon: '🌐' },
  { id: 'data_analysis', label: 'Análisis de Datos', icon: '📊' },
  { id: 'code_execution', label: 'Ejecución de Código', icon: '💻' },
  { id: 'db_access', label: 'Acceso a DB', icon: '🗄️' },
  { id: 'social_media', label: 'Redes Sociales', icon: '📱' }
];

export default function Agents() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    system_prompt: '',
    model: 'gpt-4o',
    skills: [] as string[]
  });

  const loadAgents = async () => {
    setLoading(true);
    const data = await dbService.getAgents();
    setAgents(data);
    setLoading(false);
  };

  useEffect(() => {
    loadAgents();
  }, []);

  const handleSkillToggle = (skillId: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skillId) 
        ? prev.skills.filter(s => s !== skillId)
        : [...prev.skills, skillId]
    }));
  };

  const handleCreateAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.role || !formData.system_prompt) return;

    setIsSubmitting(true);
    
    await dbService.createAgent({
      ...formData,
      status: 'offline'
    });

    // Reset and reload
    setFormData({
      name: '',
      role: '',
      system_prompt: '',
      model: 'gpt-4o',
      skills: []
    });
    setIsCreating(false);
    setIsSubmitting(false);
    loadAgents();
  };

  const handleDeleteAgent = async (id: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar a este Agente?')) {
      await dbService.deleteAgent(id);
      loadAgents();
    }
  };

  return (
    <div className="space-y-6 relative h-full">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-100 flex items-center gap-2">
            <Bot className="w-8 h-8 text-cyan-400 glow-cyan" />
            Laboratorio de Agentes
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Fábrica de ensamblaje para agentes autónomos.
          </p>
        </div>

        <button 
          onClick={() => setIsCreating(true)}
          className="bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all glow-cyan-hover"
        >
          <Plus className="w-5 h-5" />
          Nuevo Agente
        </button>
      </div>

      {/* Agents Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
        </div>
      ) : agents.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 border flex flex-col items-center justify-center text-center mt-8">
          <Cpu className="w-16 h-16 text-slate-800 mb-4" />
          <h3 className="text-xl font-bold text-slate-300 mb-2">No hay agentes activos</h3>
          <p className="text-slate-500 max-w-md">
            Instancia tu primer Agente IA desde la fábrica usando el botón superior.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {agents.map(agent => (
            <div key={agent.id} className="glass-card p-6 rounded-2xl border border-slate-800/60 hover:border-cyan-500/30 transition-all group relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500/50"></div>
              
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-200">{agent.name}</h3>
                  <p className="text-xs text-purple-400 font-mono uppercase tracking-wider">{agent.role}</p>
                </div>
                <div className="flex gap-2">
                  <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                    agent.status === 'online' ? 'bg-emerald-950/30 text-emerald-400 border border-emerald-500/30' : 
                    agent.status === 'offline' ? 'bg-slate-900 text-slate-500 border border-slate-700' :
                    'bg-amber-950/30 text-amber-400 border border-amber-500/30'
                  }`}>
                    {agent.status}
                  </span>
                </div>
              </div>

              <p className="text-sm text-slate-400 line-clamp-2 mb-4">
                &quot;{agent.system_prompt}&quot;
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                {agent.skills && agent.skills.length > 0 ? (
                  agent.skills.map(skill => (
                    <span key={skill} className="bg-slate-900 border border-slate-700 text-slate-300 text-[10px] px-2 py-1 rounded-full uppercase">
                      {skill.replace('_', ' ')}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-600 italic">Sin habilidades</span>
                )}
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
                <span className="text-xs text-slate-500 font-mono">
                  MODEL: <span className="text-cyan-500">{agent.model}</span>
                </span>
                
                <button 
                  onClick={() => handleDeleteAgent(agent.id)}
                  className="opacity-0 group-hover:opacity-100 text-rose-500 hover:text-rose-400 text-xs transition-opacity"
                >
                  Desmantelar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Creation Modal Overlay */}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setIsCreating(false)}></div>
          
          <div className="relative bg-[#0a0f18] border border-cyan-500/30 shadow-[0_0_50px_-12px_rgba(0,240,255,0.2)] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            <div className="sticky top-0 bg-[#0a0f18]/90 backdrop-blur-md p-6 border-b border-slate-800 flex justify-between items-center z-10">
              <h3 className="text-2xl font-bold flex items-center gap-2 text-slate-100">
                <Zap className="text-cyan-400 w-6 h-6" />
                Ensamblar Agente
              </h3>
              <button onClick={() => setIsCreating(false)} aria-label="Cerrar modal" title="Cerrar modal" className="text-slate-500 hover:text-rose-400 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleCreateAgent} className="p-6 space-y-6">
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-cyan-500 tracking-wider">Nombre del Agente</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Ej. OmniAnalyst"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 focus:outline-none focus:border-cyan-500/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-purple-500 tracking-wider">Rol Principal</label>
                  <input 
                    type="text" 
                    required
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    placeholder="Ej. Data Scientist"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 focus:outline-none focus:border-purple-500/50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">Prompt del Sistema (Directriz Base)</label>
                <textarea 
                  required
                  value={formData.system_prompt}
                  onChange={(e) => setFormData({...formData, system_prompt: e.target.value})}
                  placeholder="Define cómo debe comportarse el agente y su propósito primario..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 focus:outline-none focus:border-cyan-500/50 h-32 resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">Cerebro (Modelo LLM)</label>
                <select 
                  aria-label="Seleccionar Cerebro (Modelo LLM)" title="Seleccionar Cerebro (Modelo LLM)"
                  value={formData.model}
                  onChange={(e) => setFormData({...formData, model: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 focus:outline-none focus:border-cyan-500/50"
                >
                  <option value="gpt-4o">GPT-4o (Recomendado)</option>
                  <option value="gpt-4-turbo">GPT-4 Turbo</option>
                  <option value="claude-3-5-sonnet-20240620">Claude 3.5 Sonnet</option>
                  <option value="llama-3-70b">Llama 3 70B (Local/Rapido)</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">Skills Asignadas (Habilidades)</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {AVAILABLE_SKILLS.map(skill => {
                    const isSelected = formData.skills.includes(skill.id);
                    return (
                      <div 
                        key={skill.id}
                        onClick={() => handleSkillToggle(skill.id)}
                        className={`cursor-pointer p-3 rounded-xl border transition-all duration-200 flex items-center gap-2 ${
                          isSelected 
                            ? 'bg-cyan-950/30 border-cyan-500/50 text-cyan-300' 
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <span>{skill.icon}</span>
                        <span className="text-sm font-semibold">{skill.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-6 border-t border-slate-800 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-5 py-2.5 rounded-lg font-bold text-slate-400 hover:text-slate-200 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-6 py-2.5 rounded-lg font-extrabold flex items-center gap-2 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                  {isSubmitting ? 'Ensamblando...' : 'Instanciar Agente'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
