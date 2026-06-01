'use client';

import React, { useState, useEffect } from 'react';
import { 
  dbService, 
  Project, 
  EmailAccount, 
  SocialProfile, 
  Subscription,
  supabase
} from '../lib/supabase';
import Sidebar from '../components/Sidebar';
import Dashboard from '../components/Dashboard';
import CommandCenter from '../components/CommandCenter';
import AgentLog from '../components/AgentLog';
import AgentLogsLive from '../components/AgentLogsLive';
import { Database, Cloud, Cpu, Layers } from 'lucide-react';

export default function Page() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [loading, setLoading] = useState(true);

  // Core collections state
  const [projects, setProjects] = useState<Project[]>([]);
  const [emails, setEmails] = useState<EmailAccount[]>([]);
  const [socials, setSocials] = useState<SocialProfile[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);

  // Telemetry status
  const [backendMode, setBackendMode] = useState<'Cloud' | 'Local'>('Local');

  // Load collections
  const loadAllData = async () => {
    setLoading(true);
    try {
      // Determine backend state
      if (supabase) {
        setBackendMode('Cloud');
      } else {
        setBackendMode('Local');
      }

      // Fetch from dbService
      const [projData, emailData, socialData, subData] = await Promise.all([
        dbService.getProjects(),
        dbService.getEmails(),
        dbService.getSocials(),
        dbService.getSubscriptions(),
      ]);

      setProjects(projData);
      setEmails(emailData);
      setSocials(socialData);
      setSubscriptions(subData);
    } catch (error) {
      console.error('Failed to load telemetry state:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // --- CRUD Event Handlers ---
  const handleUpdateProject = async (id: string, updates: Partial<Project>) => {
    try {
      const updated = await dbService.updateProject(id, updates);
      setProjects(prev => prev.map(p => p.id === id ? updated : p));
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateProject = async (project: Omit<Project, 'id'>) => {
    try {
      const created = await dbService.createProject(project);
      setProjects(prev => [...prev, created]);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateEmail = async (email: Omit<EmailAccount, 'id'>) => {
    try {
      const created = await dbService.createEmail(email);
      setEmails(prev => [...prev, created]);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteEmail = async (id: string) => {
    try {
      const ok = await dbService.deleteEmail(id);
      if (ok) {
        setEmails(prev => prev.filter(e => e.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateSocial = async (social: Omit<SocialProfile, 'id'>) => {
    try {
      const created = await dbService.createSocial(social);
      setSocials(prev => [...prev, created]);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteSocial = async (id: string) => {
    try {
      const ok = await dbService.deleteSocial(id);
      if (ok) {
        setSocials(prev => prev.filter(s => s.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateSubscription = async (sub: Omit<Subscription, 'id'>) => {
    try {
      const created = await dbService.createSubscription(sub);
      setSubscriptions(prev => [...prev, created]);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteSubscription = async (id: string) => {
    try {
      const ok = await dbService.deleteSubscription(id);
      if (ok) {
        setSubscriptions(prev => prev.filter(s => s.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  // --- Real-time statistics aggregation ---
  const activeProjectsCount = projects.filter(p => p.status !== 'Completed').length;
  
  const monthlySubsCost = subscriptions
    .filter(s => s.status === 'Active')
    .reduce((sum, s) => {
      return sum + (s.billing_cycle === 'Monthly' ? Number(s.cost) : Number(s.cost) / 12);
    }, 0);

  const sidebarStats = {
    projectsCount: projects.length,
    activeProjectsCount,
    emailsCount: emails.length,
    monthlySubsCost
  };

  // Render components dynamically
  const renderActiveSection = () => {
    if (loading) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center min-h-[400px] gap-4">
          <div className="relative w-16 h-16">
            <span className="absolute inset-0 rounded-full border-4 border-cyan-500/10 border-t-cyan-400 animate-spin"></span>
            <Layers className="w-8 h-8 text-cyan-400 absolute top-4 left-4 animate-pulse glow-cyan" />
          </div>
          <span className="font-mono text-sm text-cyan-400/80 tracking-widest uppercase">Cargando Telemetría...</span>
        </div>
      );
    }

    switch (activeSection) {
      case 'dashboard':
        return (
          <Dashboard 
            projects={projects}
            onUpdateProject={handleUpdateProject}
            onCreateProject={handleCreateProject}
          />
        );
      case 'management':
        return (
          <CommandCenter 
            emails={emails}
            socials={socials}
            subscriptions={subscriptions}
            onCreateEmail={handleCreateEmail}
            onDeleteEmail={handleDeleteEmail}
            onCreateSocial={handleCreateSocial}
            onDeleteSocial={handleDeleteSocial}
            onCreateSubscription={handleCreateSubscription}
            onDeleteSubscription={handleDeleteSubscription}
          />
        );
      case 'logs':
        return <AgentLog />;
      case 'agent-logs':
        return <AgentLogsLive />;
      default:
        return (
          <div className="text-center text-slate-500 font-mono py-12">
            SECCIÓN DESCONOCIDA
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-[#03060f] text-slate-100 overflow-hidden">
      {/* Sidebar Navigation */}
      <Sidebar 
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        stats={sidebarStats}
      />

      {/* Main Area Viewport */}
      <main className="flex-1 h-screen overflow-y-auto px-10 py-8 relative">
        {/* Top telemetry connection status bar */}
        <div className="flex justify-end items-center gap-3 mb-6">
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-mono font-semibold tracking-wider transition-all duration-300 ${
            backendMode === 'Cloud'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
          }`}>
            {backendMode === 'Cloud' ? (
              <>
                <Cloud className="w-3.5 h-3.5" />
                SUPABASE CLOUD ACTIVE
              </>
            ) : (
              <>
                <Database className="w-3.5 h-3.5 animate-pulse" />
                LOCAL CACHE MIRROR
              </>
            )}
          </div>
          
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-purple-500/20 bg-purple-500/5 text-purple-400 text-[10px] font-mono font-semibold tracking-wider">
            <Cpu className="w-3.5 h-3.5" />
            OMNI ENGINE SECURE
          </div>
        </div>

        {/* Dynamic section viewport */}
        <div className="max-w-6xl mx-auto pb-12 transition-all duration-500 animate-in fade-in slide-in-from-bottom-3">
          {renderActiveSection()}
        </div>
      </main>
    </div>
  );
}
