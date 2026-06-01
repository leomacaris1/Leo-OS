'use client';

import React, { useState, useEffect } from 'react';
import { 
  EmailAccount, 
  SocialProfile, 
  Subscription 
} from '../lib/supabase';
import { 
  Mail, 
  Globe, 
  CreditCard, 
  Trash2, 
  Github, 
  Linkedin, 
  Twitter, 
  Youtube, 
  Link as LinkIcon,
  PlusCircle,
  TrendingUp,
  Sparkles,
  PieChart as ChartIcon,
  Edit3,
  X
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

interface CommandCenterProps {
  emails: EmailAccount[];
  socials: SocialProfile[];
  subscriptions: Subscription[];
  onCreateEmail: (email: Omit<EmailAccount, 'id'>) => Promise<void>;
  onDeleteEmail: (id: string) => Promise<void>;
  onCreateSocial: (social: Omit<SocialProfile, 'id'>) => Promise<void>;
  onDeleteSocial: (id: string) => Promise<void>;
  onCreateSubscription: (sub: Omit<Subscription, 'id'>) => Promise<void>;
  onDeleteSubscription: (id: string) => Promise<void>;
  onUpdateEmail: (id: string, updates: Partial<EmailAccount>) => Promise<void>;
  onUpdateSocial: (id: string, updates: Partial<SocialProfile>) => Promise<void>;
  onUpdateSubscription: (id: string, updates: Partial<Subscription>) => Promise<void>;
}

export default function CommandCenter({
  emails,
  socials,
  subscriptions,
  onCreateEmail,
  onDeleteEmail,
  onCreateSocial,
  onDeleteSocial,
  onCreateSubscription,
  onDeleteSubscription,
  onUpdateEmail,
  onUpdateSocial,
  onUpdateSubscription
}: CommandCenterProps) {
  // Navigation tabs: 'emails' | 'socials' | 'subscriptions'
  const [subTab, setSubTab] = useState<'emails' | 'socials' | 'subscriptions'>('emails');
  const [mounted, setMounted] = useState(false);

  // Form states for emails
  const [newEmail, setNewEmail] = useState('');
  const [emailLabel, setEmailLabel] = useState<EmailAccount['label']>('Personal');

  // Form states for socials
  const [socialPlatform, setSocialPlatform] = useState<SocialProfile['platform']>('GitHub');
  const [socialUsername, setSocialUsername] = useState('');
  const [socialUrl, setSocialUrl] = useState('');

  // Form states for subscriptions
  const [subName, setSubName] = useState('');
  const [subCost, setSubCost] = useState('');
  const [subCycle, setSubCycle] = useState<Subscription['billing_cycle']>('Monthly');
  const [subStatus, setSubStatus] = useState<Subscription['status']>('Active');
  const [subRenewalDate, setSubRenewalDate] = useState('');

  const [editingEmail, setEditingEmail] = useState<EmailAccount | null>(null);
  const [editingSocial, setEditingSocial] = useState<SocialProfile | null>(null);
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null);
  const [isAddingEmail, setIsAddingEmail] = useState(false);
  const [isAddingSocial, setIsAddingSocial] = useState(false);
  const [isAddingSubscription, setIsAddingSubscription] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handler submissions
  const handleAddEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim()) return;
    if (editingEmail) {
      await onUpdateEmail(editingEmail.id, { email: newEmail, label: emailLabel });
    } else {
      await onCreateEmail({ email: newEmail, label: emailLabel });
    }
    setNewEmail('');
    setIsAddingEmail(false);
    setEditingEmail(null);
  };

  const handleAddSocial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!socialUsername.trim() || !socialUrl.trim()) return;
    const data = {
      platform: socialPlatform,
      username: socialUsername,
      url: socialUrl.startsWith('http') ? socialUrl : `https://${socialUrl}`
    };
    if (editingSocial) {
      await onUpdateSocial(editingSocial.id, data);
    } else {
      await onCreateSocial(data);
    }
    setSocialUsername('');
    setSocialUrl('');
    setIsAddingSocial(false);
    setEditingSocial(null);
  };

  const handleAddSub = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subName.trim() || !subCost.trim()) return;
    const data = {
      name: subName,
      cost: Number(subCost),
      billing_cycle: subCycle,
      status: subStatus,
      renewal_date: subRenewalDate || undefined
    };
    if (editingSubscription) {
      await onUpdateSubscription(editingSubscription.id, data);
    } else {
      await onCreateSubscription(data);
    }
    setSubName('');
    setSubCost('');
    setSubRenewalDate('');
    setIsAddingSubscription(false);
    setEditingSubscription(null);
  };

  // Helper calculations
  const totalCostMonthly = subscriptions
    .filter(s => s.status === 'Active')
    .reduce((sum, s) => {
      return sum + (s.billing_cycle === 'Monthly' ? s.cost : s.cost / 12);
    }, 0);

  // Social Icons mapping
  const getSocialIcon = (platform: SocialProfile['platform']) => {
    switch (platform) {
      case 'GitHub':
        return <Github className="w-5 h-5 text-slate-200" />;
      case 'LinkedIn':
        return <Linkedin className="w-5 h-5 text-blue-400" />;
      case 'Twitter/X':
        return <Twitter className="w-5 h-5 text-cyan-400" />;
      case 'YouTube':
        return <Youtube className="w-5 h-5 text-rose-500" />;
      default:
        return <Globe className="w-5 h-5 text-emerald-400" />;
    }
  };

  // Prepare chart data
  const chartData = subscriptions
    .filter(s => s.status === 'Active')
    .map(s => ({
      name: s.name,
      cost: s.billing_cycle === 'Monthly' ? s.cost : Number((s.cost / 12).toFixed(2))
    }))
    .sort((a, b) => b.cost - a.cost);

  // Colors for Recharts columns
  const colors = ['#00f0ff', '#00ff87', '#bd00ff', '#ff7b00', '#ff007b', '#0090ff'];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-100 flex items-center gap-2">
          <Globe className="w-8 h-8 text-cyan-400 glow-cyan animate-spin-slow" />
          Command Center
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          Administración centralizada de identidades digitales y finanzas personales.
        </p>
      </div>

      {/* CommandCenter SubTabs switcher */}
      <div className="flex border-b border-slate-900 gap-1.5 p-1 bg-slate-950/60 rounded-2xl max-w-xl border">
        <button
          onClick={() => setSubTab('emails')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
            subTab === 'emails'
              ? 'bg-slate-900 text-cyan-400 border border-slate-800 shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Mail className="w-4 h-4" />
          Cuentas Email
        </button>
        <button
          onClick={() => setSubTab('socials')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
            subTab === 'socials'
              ? 'bg-slate-900 text-cyan-400 border border-slate-800 shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <LinkIcon className="w-4 h-4" />
          Redes Sociales
        </button>
        <button
          onClick={() => setSubTab('subscriptions')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
            subTab === 'subscriptions'
              ? 'bg-slate-900 text-cyan-400 border border-slate-800 shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          Suscripciones
        </button>
      </div>

      {/* EMAILS TAB CONTENT */}
      {subTab === 'emails' && (
        <div className="space-y-6">
          {/* Email Lists */}
          <div className="glass-card rounded-2xl p-6 border">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-200 flex items-center gap-2">
                <span>Cuentas Vinculadas</span>
                <span className="text-xs font-mono font-normal text-slate-500 bg-slate-900 px-2 py-0.5 rounded-full">{emails.length} registradas</span>
              </h3>
              <button
                onClick={() => {
                  setNewEmail('');
                  setEmailLabel('Personal');
                  setEditingEmail(null);
                  setIsAddingEmail(true);
                }}
                className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-900 font-bold px-4 py-2 rounded-xl hover:scale-105 transition-all duration-300 text-sm shadow-[0_0_15px_rgba(6,182,212,0.2)]"
              >
                <PlusCircle className="w-4 h-4" />
                Vincular Correo
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {emails.length === 0 ? (
                <div className="col-span-2 text-center py-8 text-slate-500 text-sm font-sans">
                  No hay cuentas vinculadas. Registra una nueva.
                </div>
              ) : (
                emails.map((acc) => (
                  <div key={acc.id} className="p-4 rounded-xl bg-slate-950/30 border border-slate-900/60 flex items-center justify-between hover:border-slate-800/80 transition-all duration-300">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-cyan-950/20 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                        <Mail className="w-4 h-4 glow-cyan" />
                      </div>
                      <div>
                        <div className="text-slate-200 text-sm font-medium">{acc.email}</div>
                        <span className={`inline-block text-[9px] font-mono px-2 py-0.5 rounded-full border mt-1 ${
                          acc.label === 'Personal' 
                            ? 'bg-blue-500/10 border-blue-500/20 text-blue-400'
                            : acc.label === 'Work'
                            ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                            : 'bg-purple-500/10 border-purple-500/20 text-purple-400'
                        }`}>
                          {acc.label}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-1">
                      <button
                        onClick={() => {
                          setEditingEmail(acc);
                          setNewEmail(acc.email);
                          setEmailLabel(acc.label);
                          setIsAddingEmail(true);
                        }}
                        className="text-slate-500 hover:text-cyan-400 p-2 rounded-lg hover:bg-cyan-500/10 transition-colors"
                        title="Editar cuenta"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteEmail(acc.id)}
                        className="text-slate-500 hover:text-rose-400 p-2 rounded-lg hover:bg-rose-500/10 transition-colors"
                        title="Eliminar cuenta"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* SOCIAL NETWORKS TAB CONTENT */}
      {subTab === 'socials' && (
        <div className="space-y-6">
          {/* Social profiles list */}
          <div className="glass-card rounded-2xl p-6 border">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-200 flex items-center gap-2">
                <span>Perfiles Digitales</span>
                <span className="text-xs font-mono font-normal text-slate-500 bg-slate-900 px-2 py-0.5 rounded-full">{socials.length} activos</span>
              </h3>
              <button
                onClick={() => {
                  setSocialPlatform('GitHub');
                  setSocialUsername('');
                  setSocialUrl('');
                  setEditingSocial(null);
                  setIsAddingSocial(true);
                }}
                className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-900 font-bold px-4 py-2 rounded-xl hover:scale-105 transition-all duration-300 text-sm shadow-[0_0_15px_rgba(6,182,212,0.2)]"
              >
                <PlusCircle className="w-4 h-4" />
                Agregar Perfil
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {socials.length === 0 ? (
                <div className="col-span-full text-center py-8 text-slate-500 text-sm">
                  No hay perfiles de redes sociales creados. Crea uno nuevo.
                </div>
              ) : (
                socials.map((prof) => (
                  <div key={prof.id} className="p-4 rounded-xl bg-slate-950/30 border border-slate-900/60 flex items-center justify-between hover:border-slate-800/80 transition-all duration-300 group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-900/40 border border-slate-850 flex items-center justify-center">
                        {getSocialIcon(prof.platform)}
                      </div>
                      <div>
                        <div className="text-slate-200 text-sm font-semibold">{prof.platform}</div>
                        <a 
                          href={prof.url} 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-xs text-cyan-400/80 hover:text-cyan-300 hover:underline flex items-center gap-1 mt-0.5"
                        >
                          {prof.username}
                        </a>
                      </div>
                    </div>

                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 duration-300">
                      <button
                        onClick={() => {
                          setEditingSocial(prof);
                          setSocialPlatform(prof.platform);
                          setSocialUsername(prof.username);
                          setSocialUrl(prof.url);
                          setIsAddingSocial(true);
                        }}
                        className="text-slate-500 hover:text-cyan-400 p-1.5 rounded-lg hover:bg-cyan-500/10 transition-colors"
                        title="Editar perfil"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteSocial(prof.id)}
                        className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-500/10 transition-colors"
                        title="Eliminar perfil"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* SUBSCRIPTIONS & FINANCES TAB CONTENT */}
      {subTab === 'subscriptions' && (
        <div className="space-y-6">
          {/* Top Quick Overhead Stats banner */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card rounded-2xl p-6 border flex items-center gap-4 relative overflow-hidden ring-1 ring-orange-500/50 shadow-[0_0_30px_rgba(249,115,22,0.15)]">
              <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/10 rounded-full blur-2xl"></div>
              <div className="w-12 h-12 rounded-xl bg-orange-950/20 border border-orange-500/20 flex items-center justify-center text-orange-400">
                <CreditCard className="w-6 h-6 animate-pulse glow-orange" />
              </div>
              <div>
                <div className="text-xs text-orange-400/80 uppercase font-bold tracking-widest mb-1">Costo Total Mensual</div>
                <div className="text-4xl font-extrabold text-white font-mono mt-0.5 tracking-tight drop-shadow-[0_0_10px_rgba(249,115,22,0.5)]">
                  ${totalCostMonthly.toFixed(2)}<span className="text-lg text-orange-400/60 ml-1">/mes</span>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6 border flex items-center gap-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl"></div>
              <div className="w-12 h-12 rounded-xl bg-emerald-950/20 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs text-slate-400 uppercase font-mono tracking-wider">Proyección Anual</div>
                <div className="text-3xl font-extrabold text-slate-100 font-mono mt-0.5">
                  ${(totalCostMonthly * 12).toFixed(2)}
                </div>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6 border flex items-center gap-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl"></div>
              <div className="w-12 h-12 rounded-xl bg-cyan-950/20 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs text-slate-400 uppercase font-mono tracking-wider">Servicios Activos</div>
                <div className="text-3xl font-extrabold text-slate-100 font-mono mt-0.5">
                  {subscriptions.filter(s => s.status === 'Active').length} / {subscriptions.length}
                </div>
              </div>
            </div>
          </div>
          <div className="glass-card rounded-2xl p-6 border">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-200 flex items-center gap-2">
                <span>Listado de Gastos</span>
                <span className="text-xs font-mono font-normal text-slate-500 bg-slate-900 px-2 py-0.5 rounded-full">{subscriptions.length} registrados</span>
              </h3>
              <button
                onClick={() => {
                  setSubName('');
                  setSubCost('');
                  setSubCycle('Monthly');
                  setSubStatus('Active');
                  setSubRenewalDate('');
                  setEditingSubscription(null);
                  setIsAddingSubscription(true);
                }}
                className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-rose-500 text-slate-900 font-bold px-4 py-2 rounded-xl hover:scale-105 transition-all duration-300 text-sm shadow-[0_0_15px_rgba(249,115,22,0.2)]"
              >
                <PlusCircle className="w-4 h-4" />
                Nueva Suscripción
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Distribution Chart */}
              {mounted && chartData.length > 0 && (
                <div className="glass-card rounded-2xl p-6 border">
                  <h3 className="text-sm font-bold text-slate-300 mb-4 uppercase tracking-wider font-mono flex items-center gap-2">
                    <ChartIcon className="w-4 h-4 text-cyan-400" />
                    Distribución de Costos Mensuales (USD)
                  </h3>
                  <div className="w-full h-44">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                        <XAxis 
                          dataKey="name" 
                          stroke="#475569" 
                          fontSize={10} 
                          tickLine={false} 
                          axisLine={false}
                        />
                        <YAxis 
                          stroke="#475569" 
                          fontSize={10} 
                          tickLine={false} 
                          axisLine={false}
                          tickFormatter={(val) => `$${val}`}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#0a0e1a', 
                            borderColor: 'rgba(255,255,255,0.08)',
                            borderRadius: '12px',
                            color: '#e2e8f0'
                          }} 
                          formatter={(value) => [`$${value}`, 'Costo Mensual']}
                        />
                        <Bar dataKey="cost" radius={[4, 4, 0, 0]}>
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* Subscriptions Grid */}
              <div className="lg:col-span-2">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-900 text-slate-400 text-xs font-mono tracking-wider">
                        <th className="pb-3 font-semibold">Servicio</th>
                        <th className="pb-3 font-semibold">Costo</th>
                        <th className="pb-3 font-semibold">Ciclo</th>
                        <th className="pb-3 font-semibold">Renovación</th>
                        <th className="pb-3 font-semibold">Estado</th>
                        <th className="pb-3 font-semibold text-right">Acción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subscriptions.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="text-center py-6 text-slate-500 text-sm">
                            No hay suscripciones activas.
                          </td>
                        </tr>
                      ) : (
                        subscriptions.map((sub) => {
                          const isAI = /ai|chatgpt|gemini|claude|midjourney|copilot|openai|anthropic/i.test(sub.name);
                          return (
                            <tr key={sub.id} className="border-b border-slate-900/60 hover:bg-slate-950/10 transition-colors">
                              <td className="py-3.5 text-sm font-semibold text-slate-200 flex items-center gap-2">
                                {isAI && <span title="Servicio de IA" className="text-lg">🤖</span>}
                                {sub.name}
                              </td>
                              <td className="py-3.5 text-sm font-mono font-bold text-slate-300">${Number(sub.cost).toFixed(2)}</td>
                              <td className="py-3.5 text-xs text-slate-400">{sub.billing_cycle === 'Monthly' ? 'Mensual' : 'Anual'}</td>
                              <td className="py-3.5 text-xs text-slate-400">{sub.renewal_date ? new Date(sub.renewal_date).toLocaleDateString() : '-'}</td>
                              <td className="py-3.5 text-xs">
                                <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                                  sub.status === 'Active'
                                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                                    : sub.status === 'Paused'
                                    ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                                    : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                                }`}>
                                  {sub.status}
                                </span>
                              </td>
                              <td className="py-3.5 text-right space-x-1">
                                <button
                                  onClick={() => {
                                    setEditingSubscription(sub);
                                    setSubName(sub.name);
                                    setSubCost(sub.cost.toString());
                                    setSubCycle(sub.billing_cycle);
                                    setSubStatus(sub.status);
                                    setSubRenewalDate(sub.renewal_date || '');
                                  }}
                                  className="text-slate-500 hover:text-cyan-400 p-2 rounded-lg hover:bg-cyan-500/10 transition-colors"
                                  title="Editar servicio"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => onDeleteSubscription(sub.id)}
                                  className="text-slate-500 hover:text-rose-400 p-2 rounded-lg hover:bg-rose-500/10 transition-colors"
                                  title="Eliminar servicio"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODALS */}
      {/* Email Modal */}
      {isAddingEmail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-[#0a0e1a] border border-cyan-500/20 rounded-2xl w-full max-w-md p-6 shadow-[0_0_40px_rgba(6,182,212,0.15)] relative">
            <button 
              onClick={() => { setIsAddingEmail(false); setEditingEmail(null); }}
              className="absolute top-4 right-4 text-slate-500 hover:text-rose-400 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-slate-200 mb-6 flex items-center gap-2">
              <PlusCircle className="w-6 h-6 text-cyan-400" />
              {editingEmail ? 'Editar Correo' : 'Vincular Correo'}
            </h3>
            <form onSubmit={handleAddEmail} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Correo Electrónico</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="ej: leomacaris1@gmail.com"
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-cyan-500/50 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Etiqueta</label>
                <select
                  value={emailLabel}
                  onChange={(e) => setEmailLabel(e.target.value as EmailAccount['label'])}
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-cyan-500/50 text-sm"
                >
                  <option value="Personal">Personal</option>
                  <option value="Work">Trabajo</option>
                  <option value="Development">Desarrollo</option>
                  <option value="Archive">Archivo</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-900 font-bold px-4 py-3 rounded-xl transition-all duration-300 text-sm shadow-[0_0_15px_rgba(6,182,212,0.2)] mt-4"
              >
                {editingEmail ? 'Guardar Cambios' : 'Vincular Cuenta'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Social Modal */}
      {isAddingSocial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-[#0a0e1a] border border-cyan-500/20 rounded-2xl w-full max-w-md p-6 shadow-[0_0_40px_rgba(6,182,212,0.15)] relative">
            <button 
              onClick={() => { setIsAddingSocial(false); setEditingSocial(null); }}
              className="absolute top-4 right-4 text-slate-500 hover:text-rose-400 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-slate-200 mb-6 flex items-center gap-2">
              <PlusCircle className="w-6 h-6 text-cyan-400" />
              {editingSocial ? 'Editar Perfil' : 'Agregar Perfil'}
            </h3>
            <form onSubmit={handleAddSocial} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Plataforma</label>
                <select
                  value={socialPlatform}
                  onChange={(e) => setSocialPlatform(e.target.value as SocialProfile['platform'])}
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-cyan-500/50 text-sm"
                >
                  <option value="GitHub">GitHub</option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="Twitter/X">Twitter/X</option>
                  <option value="YouTube">YouTube</option>
                  <option value="Portfolio">Portafolio Web</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Nombre de Usuario</label>
                <input
                  type="text"
                  value={socialUsername}
                  onChange={(e) => setSocialUsername(e.target.value)}
                  placeholder="ej: leomacaris"
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-cyan-500/50 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">URL del Perfil</label>
                <input
                  type="text"
                  value={socialUrl}
                  onChange={(e) => setSocialUrl(e.target.value)}
                  placeholder="github.com/leomacaris"
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-cyan-500/50 text-sm"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-900 font-bold px-4 py-3 rounded-xl transition-all duration-300 text-sm shadow-[0_0_15px_rgba(6,182,212,0.2)] mt-4"
              >
                {editingSocial ? 'Guardar Cambios' : 'Guardar Perfil'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Subscription Modal */}
      {isAddingSubscription && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-[#0a0e1a] border border-orange-500/20 rounded-2xl w-full max-w-md p-6 shadow-[0_0_40px_rgba(249,115,22,0.15)] relative">
            <button 
              onClick={() => { setIsAddingSubscription(false); setEditingSubscription(null); }}
              className="absolute top-4 right-4 text-slate-500 hover:text-rose-400 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-slate-200 mb-6 flex items-center gap-2">
              <PlusCircle className="w-6 h-6 text-orange-400" />
              {editingSubscription ? 'Editar Suscripción' : 'Nueva Suscripción'}
            </h3>
            <form onSubmit={handleAddSub} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Nombre del Servicio</label>
                <input
                  type="text"
                  value={subName}
                  onChange={(e) => setSubName(e.target.value)}
                  placeholder="ej: ChatGPT Plus"
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-2 text-slate-200 focus:outline-none focus:border-orange-500/50 text-sm"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Costo (USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={subCost}
                    onChange={(e) => setSubCost(e.target.value)}
                    placeholder="20.00"
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-2 text-slate-200 focus:outline-none focus:border-orange-500/50 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Ciclo</label>
                  <select
                    value={subCycle}
                    onChange={(e) => setSubCycle(e.target.value as Subscription['billing_cycle'])}
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-2 text-slate-200 focus:outline-none focus:border-orange-500/50 text-sm"
                  >
                    <option value="Monthly">Mensual</option>
                    <option value="Annually">Anual</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Estado</label>
                  <select
                    value={subStatus}
                    onChange={(e) => setSubStatus(e.target.value as Subscription['status'])}
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-2 text-slate-200 focus:outline-none focus:border-orange-500/50 text-sm"
                  >
                    <option value="Active">Activo</option>
                    <option value="Paused">Pausado</option>
                    <option value="Expired">Vencido</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Renovación</label>
                  <input
                    type="date"
                    value={subRenewalDate}
                    onChange={(e) => setSubRenewalDate(e.target.value)}
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-2 text-slate-200 focus:outline-none focus:border-orange-500/50 text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-slate-950 font-bold px-4 py-3 rounded-xl transition-all duration-300 text-sm shadow-[0_0_15px_rgba(249,115,22,0.2)] mt-4"
              >
                {editingSubscription ? 'Guardar Cambios' : 'Registrar Servicio'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
