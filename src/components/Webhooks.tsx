'use client';

import React, { useState } from 'react';
import { Webhook, Terminal, Copy, Check, Zap, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';

export default function Webhooks() {
  const [isCopied, setIsCopied] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  
  // Endpoint relative to the origin
  const endpoint = typeof window !== 'undefined' ? `${window.location.origin}/api/webhooks/nexus` : '/api/webhooks/nexus';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(endpoint);
    setIsCopied(true);
    toast('URL Copiada al portapapeles');
    setTimeout(() => setIsCopied(false), 2000);
  };

  const testWebhook = async () => {
    setIsTesting(true);
    try {
      const payload = {
        event: 'test_event',
        component: 'WebhookTester',
        message: 'Esta es una prueba de sistema del webhook.',
        notify: true,
        notification: {
          title: 'Prueba de Webhook Exitosa',
          type: 'success',
          source: 'System Webhook Tester'
        },
        log: {
          level: 'INFO',
          message: 'Webhook recibido correctamente a través de la interfaz de pruebas.'
        }
      };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Default secret if running in dev without one
          'Authorization': 'Bearer test-secret' 
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        toast.success('Webhook disparado correctamente');
      } else {
        const errorData = await res.json();
        toast.error(`Error: ${errorData.error || 'Fallo de autorización'}`);
      }
    } catch {
      toast.error('Error de red al disparar Webhook');
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="space-y-6 relative h-full">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-100 flex items-center gap-2">
            <Webhook className="w-8 h-8 text-fuchsia-400 glow-purple" />
            Webhooks & API
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Centro de integraciones y recepción de eventos externos.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* Left Column: Settings & Testing */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="glass-card rounded-2xl p-6 border border-slate-800/60">
            <h3 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-fuchsia-400" />
              Endpoint de Recepción Nexus
            </h3>
            
            <p className="text-slate-400 text-sm mb-4">
              Usa este endpoint para enviar logs o notificaciones a Leo OS desde cualquier servicio externo (ej. GitHub Actions, Vercel, o un Agente remoto).
            </p>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-1 flex items-center mb-6">
              <div className="px-4 text-slate-500 bg-slate-900/50 py-2 rounded-l-lg border-r border-slate-800 font-mono text-sm">
                POST
              </div>
              <div className="px-4 flex-1 font-mono text-sm text-cyan-400 overflow-hidden text-ellipsis whitespace-nowrap">
                {endpoint}
              </div>
              <button 
                onClick={copyToClipboard}
                className="p-2 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors rounded-lg mr-1"
              >
                {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <div className="bg-amber-950/20 border border-amber-500/30 rounded-xl p-4 flex gap-3 mb-6">
              <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0" />
              <div className="text-sm text-amber-200/80">
                <strong>Autenticación Requerida:</strong> En producción, debes enviar un header <code className="bg-amber-900/40 px-1 rounded text-amber-300">Authorization: Bearer TU_SECRETO</code> configurado en las variables de entorno (<code className="bg-amber-900/40 px-1 rounded text-amber-300">NEXUS_WEBHOOK_SECRET</code>).
              </div>
            </div>

            <button 
              onClick={testWebhook}
              disabled={isTesting}
              className="bg-fuchsia-500/10 hover:bg-fuchsia-500/20 text-fuchsia-400 border border-fuchsia-500/50 w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              <Terminal className="w-5 h-5" />
              {isTesting ? 'Enviando payload...' : 'Disparar Webhook de Prueba'}
            </button>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-slate-800/60">
            <h3 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
              <Terminal className="w-5 h-5 text-slate-400" />
              Estructura del Payload (JSON)
            </h3>
            
            <pre className="bg-[#050914] border border-slate-800 rounded-xl p-4 overflow-x-auto text-xs font-mono text-slate-300">
{`{
  "event": "system_alert",
  "component": "Vercel Deploy",
  "message": "Despliegue exitoso en producción",
  "notify": true,
  "notification": {
    "title": "Vercel: Despliegue OK",
    "type": "success"
  },
  "log": {
    "level": "INFO",
    "message": "Commit a73f8b desplegado en 45s."
  }
}`}
            </pre>
          </div>

        </div>

        {/* Right Column: Information & Integrations */}
        <div className="space-y-6">
          <div className="glass-card rounded-2xl p-6 border border-slate-800/60 bg-gradient-to-b from-slate-900/80 to-transparent">
            <h3 className="text-lg font-bold text-slate-200 mb-4">Ejemplo en cURL</h3>
            <pre className="bg-[#050914] border border-slate-800 rounded-xl p-4 overflow-x-auto text-[10px] font-mono text-cyan-400 mb-4">
{`curl -X POST \\
  ${endpoint} \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer TU_SECRETO" \\
  -d '{"message":"Hola desde cURL","notify":true}'`}
            </pre>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-slate-800/60">
            <h3 className="text-lg font-bold text-slate-200 mb-4">Tipos Soportados</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/50">
                <span className="text-xs text-slate-400 font-mono">type: &quot;info&quot;</span>
                <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/50">
                <span className="text-xs text-slate-400 font-mono">type: &quot;success&quot;</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/50">
                <span className="text-xs text-slate-400 font-mono">type: &quot;warning&quot;</span>
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/50">
                <span className="text-xs text-slate-400 font-mono">type: &quot;error&quot;</span>
                <span className="w-2 h-2 rounded-full bg-rose-400"></span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
