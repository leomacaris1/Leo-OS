import React, { useState, useEffect, useRef } from 'react';
import { dbService, Agent } from '../lib/supabase';
import { Bot, Send, User, MessageSquare, Terminal, Cpu, RotateCcw, Activity } from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function AgentSandbox() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadAgents = async () => {
      setLoading(true);
      const data = await dbService.getAgents();
      setAgents(data);
      if (data.length > 0 && !selectedAgentId) {
        setSelectedAgentId(data[0].id);
      }
      setLoading(false);
    };
    loadAgents();
  }, [selectedAgentId]);

  useEffect(() => {
    // Scroll to bottom whenever messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleAgentSelect = (id: string) => {
    setSelectedAgentId(id);
    setMessages([]); // Clear chat on agent switch
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !selectedAgentId) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    const activeAgent = agents.find(a => a.id === selectedAgentId);

    // Simulate API delay
    setTimeout(() => {
      setIsTyping(false);
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `[Simulación] He recibido tu mensaje. Actuando bajo mi directiva principal de rol: "${activeAgent?.role}". Mi prompt actual me indica: "${activeAgent?.system_prompt}". Esta es una respuesta generada localmente para probar la interfaz del Sandbox.`,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    }, 1500 + Math.random() * 1000); // 1.5s to 2.5s delay
  };

  const selectedAgent = agents.find(a => a.id === selectedAgentId);

  return (
    <div className="flex h-[calc(100vh-8rem)] bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl relative z-10">
      
      {/* Sidebar - Agent List */}
      <div className="w-80 border-r border-slate-800 bg-slate-950/50 flex flex-col">
        <div className="p-4 border-b border-slate-800">
          <div className="flex items-center gap-2 mb-1">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-slate-200">Sandbox</h2>
          </div>
          <p className="text-xs text-slate-500">Prueba y entrena a tus agentes localmente.</p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-3">
          {loading ? (
            <div className="text-center py-10 text-slate-500 animate-pulse text-sm">Cargando agentes...</div>
          ) : agents.length === 0 ? (
            <div className="text-center py-10 text-slate-600 text-sm">
              No hay agentes disponibles. Crea uno en la Fábrica primero.
            </div>
          ) : (
            <ul className="space-y-2">
              {agents.map(agent => (
                <li key={agent.id}>
                  <button
                    onClick={() => handleAgentSelect(agent.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all ${
                      selectedAgentId === agent.id 
                        ? 'bg-cyan-500/10 border border-cyan-500/30' 
                        : 'border border-transparent hover:bg-slate-800/50 hover:border-slate-700/50'
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${
                      selectedAgentId === agent.id ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-900 text-slate-400'
                    }`}>
                      <Bot className="w-5 h-5" />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <div className={`font-semibold text-sm truncate ${
                        selectedAgentId === agent.id ? 'text-cyan-400' : 'text-slate-300'
                      }`}>
                        {agent.name}
                      </div>
                      <div className="text-xs text-slate-500 truncate">{agent.role}</div>
                    </div>
                    <div className={`w-2 h-2 rounded-full ${
                      agent.status === 'online' ? 'bg-emerald-500' : 
                      agent.status === 'busy' ? 'bg-amber-500' : 
                      'bg-slate-600'
                    }`} title={`Status: ${agent.status}`} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-[#0a0e1a] relative">
        {selectedAgent ? (
          <>
            {/* Chat Header */}
            <div className="h-16 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-900/50 shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-cyan-500/10 rounded-lg text-cyan-400">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-slate-200 font-bold leading-tight">{selectedAgent.name}</h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Activity className="w-3 h-3 text-emerald-400" /> Simulación Local
                    </span>
                    <span>•</span>
                    <span className="font-mono">{selectedAgent.model}</span>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={() => setMessages([])}
                className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-slate-200 bg-slate-800/50 hover:bg-slate-800 px-3 py-1.5 rounded-full transition-colors border border-slate-700/50"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Limpiar Sesión
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-500">
                  <MessageSquare className="w-12 h-12 mb-4 opacity-20" />
                  <p className="text-lg font-medium text-slate-400">Comienza a chatear con {selectedAgent.name}</p>
                  <p className="text-sm text-slate-600 max-w-sm text-center mt-2">
                    Las respuestas serán simuladas usando el prompt del sistema: <br/>
                    <span className="text-xs font-mono text-cyan-500/70 mt-2 block bg-cyan-950/20 p-2 rounded-lg border border-cyan-500/10">&quot;{selectedAgent.system_prompt}&quot;</span>
                  </p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div key={msg.id} className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
                    <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      msg.role === 'user' ? 'bg-purple-500/20 text-purple-400' : 'bg-cyan-500/20 text-cyan-400'
                    }`}>
                      {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>
                    <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                      msg.role === 'user' 
                        ? 'bg-purple-600/20 border border-purple-500/30 text-purple-100 rounded-tr-sm' 
                        : 'bg-slate-800/80 border border-slate-700 text-slate-300 rounded-tl-sm'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                ))
              )}
              
              {isTyping && (
                <div className="flex gap-4 max-w-[85%]">
                  <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-cyan-500/20 text-cyan-400">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 rounded-tl-sm flex items-center gap-1.5 h-[52px]">
                    <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce"></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-slate-950/80 border-t border-slate-800 backdrop-blur-md shrink-0">
              <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto relative">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={`Escribe un mensaje para ${selectedAgent.name}...`}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-5 pr-14 py-4 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 shadow-inner"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isTyping}
                  className="absolute right-2 top-2 bottom-2 aspect-square flex items-center justify-center bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 rounded-lg transition-colors"
                >
                  <Send className="w-5 h-5 ml-0.5" />
                </button>
              </form>
              <div className="text-center mt-2">
                <span className="text-[10px] text-slate-600 flex items-center justify-center gap-1">
                  <Terminal className="w-3 h-3" /> Las interacciones son simuladas localmente y no consumen créditos de API.
                </span>
              </div>
            </div>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-500">
            <Bot className="w-16 h-16 mb-4 opacity-20" />
            <p className="text-lg font-medium text-slate-400">Ningún agente seleccionado</p>
            <p className="text-sm">Selecciona un agente de la lista para comenzar la simulación.</p>
          </div>
        )}
      </div>
    </div>
  );
}
