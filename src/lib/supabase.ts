import { createClient } from '@supabase/supabase-js';

// Define types for TypeScript safety
export interface Project {
  id: string;
  name: string;
  status: string;
  progress: number;
  tech_stack: string[];
  description?: string;
  repo_url?: string;
  live_url?: string;
  created_at?: string;
}

export interface EmailAccount {
  id: string;
  email: string;
  label: 'Personal' | 'Work' | 'Development' | 'Archive';
  created_at?: string;
}

export interface SocialProfile {
  id: string;
  platform: 'GitHub' | 'LinkedIn' | 'Twitter/X' | 'YouTube' | 'Portfolio';
  username: string;
  url: string;
  created_at?: string;
}

export interface Subscription {
  id: string;
  name: string;
  cost: number;
  billing_cycle: 'Monthly' | 'Annually';
  status: 'Active' | 'Paused' | 'Expired';
  renewal_date?: string;
  created_at?: string;
}

export interface ProjectTask {
  id: string;
  project_id: string;
  title?: string;
  description: string;
  status?: 'pending' | 'in_progress' | 'completed';
  is_completed?: boolean;
  created_at?: string;
}

export interface Agent {
  id: string;
  name: string;
  role: string;
  system_prompt: string;
  model: string;
  status: 'online' | 'offline' | 'busy' | 'training';
  skills: string[];
  created_at: string;
}

export interface AgentLogEntry {
  id: string;
  level: string;
  component: string;
  message: string;
  created_at: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  source: string;
  created_at: string;
}

// Retrieve environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Initialize Supabase Client safely
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

// Initial Mock Data (used as seed for LocalStorage fallback)
const INITIAL_PROJECTS: Project[] = [
  { id: 'p1', name: 'mmnexus-hub', status: '🟢 Full Green', progress: 95, tech_stack: ['Next.js', 'React', 'Tailwind CSS', 'Vercel', 'Supabase'], description: 'Hub central del ecosistema M&M Nexus.', repo_url: 'https://github.com/leomacaris/mmnexus-hub', live_url: 'https://mmnexus-hub.vercel.app' },
  { id: 'p2', name: 'OmniAgent v7.0', status: '🟡 Conectando LLM', progress: 85, tech_stack: ['Python', 'LangChain', 'FastAPI', 'OpenAI', 'GPT-4'], description: 'Agente autónomo de IA con capacidad multi-modelo.', repo_url: 'https://github.com/leomacaris/OmniAgent' },
  { id: 'p3', name: 'CoreOps', status: '🟣 En Producción', progress: 90, tech_stack: ['Go', 'Docker', 'Kubernetes', 'gRPC', 'Terraform'], description: 'Infraestructura core de operaciones.' },
  { id: 'p4', name: 'MoneyFlow Pro', status: '🟢 MVP Funcional', progress: 80, tech_stack: ['TypeScript', 'React', 'Supabase', 'Stripe', 'Recharts'], description: 'Plataforma de gestión financiera personal.', repo_url: 'https://github.com/leomacaris/moneyflow-pro', live_url: 'https://moneyflow.pro' },
  { id: 'p5', name: 'Fabrica de Productos', status: '🟢 Motor Activo', progress: 35, tech_stack: ['React', 'Node.js', 'Supabase', 'Stripe'], description: 'Sistema de productos digitales escalables.' },
  { id: 'p6', name: 'Digital Business', status: '🔵 Estrategia', progress: 40, tech_stack: ['Next.js', 'Tailwind CSS', 'Supabase', 'Analytics'], description: 'Ecosistema de negocios digitales.' },
];

const INITIAL_EMAILS: EmailAccount[] = [
  { id: 'e1', email: 'leomacaris1@gmail.com', label: 'Personal' },
  { id: 'e2', email: 'leo.macaris.work@outlook.com', label: 'Work' },
  { id: 'e3', email: 'dev.leomacaris@gmail.com', label: 'Development' },
];

const INITIAL_SOCIALS: SocialProfile[] = [
  { id: 's1', platform: 'GitHub', username: 'leomacaris', url: 'https://github.com/leomacaris' },
  { id: 's2', platform: 'LinkedIn', username: 'Leo Macaris', url: 'https://linkedin.com/in/leomacaris' },
  { id: 's3', platform: 'Twitter/X', username: '@leomacaris', url: 'https://x.com/leomacaris' },
];

const INITIAL_SUBSCRIPTIONS: Subscription[] = [
  { id: 'sub1', name: 'ChatGPT Plus', cost: 20.00, billing_cycle: 'Monthly', status: 'Active', renewal_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
  { id: 'sub2', name: 'Netflix Premium', cost: 15.49, billing_cycle: 'Monthly', status: 'Active', renewal_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
  { id: 'sub3', name: 'Spotify Family', cost: 10.99, billing_cycle: 'Monthly', status: 'Active', renewal_date: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
  { id: 'sub4', name: 'GitHub Copilot', cost: 10.00, billing_cycle: 'Monthly', status: 'Active', renewal_date: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
  { id: 'sub5', name: 'Vercel Pro', cost: 20.00, billing_cycle: 'Monthly', status: 'Active', renewal_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
];

const INITIAL_AGENT_LOGS: AgentLogEntry[] = [
  { id: 'al1', created_at: new Date(Date.now() - 3600000).toISOString(), level: 'INFO', component: 'Brain', message: 'Sistema de telemetría de logs iniciado.' },
  { id: 'al2', created_at: new Date(Date.now() - 3000000).toISOString(), level: 'SUCCESS', component: 'Brain', message: 'OmniAgent conectado con éxito.' },
  { id: 'al3', created_at: new Date(Date.now() - 1800000).toISOString(), level: 'INFO', component: 'shell_ops', message: 'Escaneando archivos en el directorio local...' },
];

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  { id: 'n1', title: 'Bienvenido a Leo OS', message: 'El sistema ha sido inicializado correctamente.', type: 'info', read: false, source: 'system', created_at: new Date().toISOString() }
];

const INITIAL_PROJECT_TASKS: ProjectTask[] = [
  { id: 't1', project_id: 'p1', title: 'Setup', description: 'Configurar variables de entorno', status: 'completed', created_at: new Date().toISOString() },
  { id: 't2', project_id: 'p1', title: 'Integration', description: 'Integrar OmniAgent', status: 'pending', created_at: new Date().toISOString() },
];

// Helper to check if a value is in client-side context (browsers)
const isBrowser = typeof window !== 'undefined';
const SUPABASE_QUERY_TIMEOUT_MS = 4500;

const withSupabaseTimeout = async <T>(query: PromiseLike<T>, label: string): Promise<T> => {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(`${label} timed out after ${SUPABASE_QUERY_TIMEOUT_MS}ms`));
    }, SUPABASE_QUERY_TIMEOUT_MS);
  });

  try {
    return await Promise.race([query, timeout]);
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }
};

// LocalStorage Helper functions
const getLocalData = <T>(key: string, initial: T[]): T[] => {
  if (!isBrowser) return initial;
  const stored = localStorage.getItem(key);
  if (!stored) {
    localStorage.setItem(key, JSON.stringify(initial));
    return initial;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return initial;
  }
};

const setLocalData = <T>(key: string, data: T[]): void => {
  if (isBrowser) {
    localStorage.setItem(key, JSON.stringify(data));
  }
};

// Helper to mimic the Supabase trigger for project progress in local storage
const _recalculateLocalProjectProgress = (projectId: string) => {
  const tasks = getLocalData<ProjectTask>('leo-os-tasks', INITIAL_PROJECT_TASKS).filter(t => t.project_id === projectId);
  const total = tasks.length;
  const completed = tasks.filter(t => t.is_completed || t.status === 'completed').length;
  const newProgress = total === 0 ? 0 : Math.round((completed * 100) / total);

  const projects = getLocalData<Project>('leo-os-projects', INITIAL_PROJECTS);
  const pIndex = projects.findIndex(p => p.id === projectId);
  if (pIndex !== -1) {
    projects[pIndex].progress = newProgress;
    setLocalData('leo-os-projects', projects);
    
    // Dispatch a custom event so the UI can update if needed
    if (isBrowser) {
      window.dispatchEvent(new Event('local-db-changed'));
    }
  }
};

// Unified DB Service providing simple CRUD functionality
export const dbService = {
  // --- PROJECTS SERVICES ---
  async getProjects(): Promise<Project[]> {
    if (supabase) {
      try {
        const { data, error } = await withSupabaseTimeout(
          supabase
            .from('projects')
            .select('*')
            .order('created_at', { ascending: true }),
          'projects fetch'
        );
        
        if (!error && data) {
          setLocalData('leo-os-projects', data); // Sync cache
          return data as Project[];
        }
        console.warn('Supabase fetch error, falling back to local:', error);
      } catch (err) {
        console.error('Supabase connection failed:', err);
      }
    }
    return getLocalData<Project>('leo-os-projects', INITIAL_PROJECTS);
  },

  async updateProject(id: string, updates: Partial<Project>): Promise<Project> {
    if (supabase) {
      try {
        // If the ID is a local mock ID (e.g. 'p1'), we should find the database equivalent or create it, 
        // but for general development updates we try directly.
        const { data, error } = await supabase
          .from('projects')
          .update(updates)
          .eq('id', id)
          .select();

        if (!error && data && data.length > 0) {
          // Sync local storage
          const local = getLocalData<Project>('leo-os-projects', INITIAL_PROJECTS);
          const idx = local.findIndex(p => p.id === id);
          if (idx !== -1) {
            local[idx] = { ...local[idx], ...updates };
            setLocalData('leo-os-projects', local);
          }
          return data[0] as Project;
        }
        console.warn('Supabase update failed, updating local storage:', error);
      } catch (err) {
        console.error('Supabase connection failed during update:', err);
      }
    }

    // LocalStorage edit
    const local = getLocalData<Project>('leo-os-projects', INITIAL_PROJECTS);
    const idx = local.findIndex(p => p.id === id);
    if (idx !== -1) {
      local[idx] = { ...local[idx], ...updates };
      setLocalData('leo-os-projects', local);
      return local[idx];
    }
    throw new Error('Project not found');
  },

  async createProject(project: Omit<Project, 'id'>): Promise<Project> {
    const newProject = {
      ...project,
      id: supabase ? undefined : `p_${Date.now()}` // supabase generates uuid
    };

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('projects')
          .insert([newProject])
          .select();
        
        if (!error && data && data.length > 0) {
          const created = data[0] as Project;
          const local = getLocalData<Project>('leo-os-projects', INITIAL_PROJECTS);
          local.push(created);
          setLocalData('leo-os-projects', local);
          return created;
        }
        console.warn('Supabase insert failed, inserting local:', error);
      } catch (err) {
        console.error('Supabase connection failed during insert:', err);
      }
    }

    const localProject = { ...project, id: `p_${Date.now()}` };
    const local = getLocalData<Project>('leo-os-projects', INITIAL_PROJECTS);
    local.push(localProject);
    setLocalData('leo-os-projects', local);
    return localProject;
  },

  // --- PROJECT TASKS ---
  async getProjectTasks(projectId: string): Promise<ProjectTask[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('project_tasks')
          .select('*')
          .eq('project_id', projectId)
          .order('created_at', { ascending: true });
        
        if (!error && data) {
          // Keep local tasks in sync to avoid mismatches
          const allLocalTasks = getLocalData<ProjectTask>('leo-os-tasks', INITIAL_PROJECT_TASKS);
          const otherTasks = allLocalTasks.filter(t => t.project_id !== projectId);
          setLocalData('leo-os-tasks', [...otherTasks, ...data as ProjectTask[]]);
          return data as ProjectTask[];
        }
      } catch (err) {
        console.error(err);
      }
    }
    const local = getLocalData<ProjectTask>('leo-os-tasks', INITIAL_PROJECT_TASKS);
    return local.filter(t => t.project_id === projectId);
  },

  async createProjectTask(task: Omit<ProjectTask, 'id'>): Promise<ProjectTask | null> {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('project_tasks')
          .insert([task])
          .select();
        if (!error && data && data.length > 0) {
          return data[0] as ProjectTask;
        }
        console.error('Error creating task:', error);
      } catch (err) {
        console.error(err);
      }
    }
    
    const localTask: ProjectTask = {
      ...task,
      id: `t_${Date.now()}`,
      created_at: new Date().toISOString()
    };
    const local = getLocalData<ProjectTask>('leo-os-tasks', INITIAL_PROJECT_TASKS);
    local.push(localTask);
    setLocalData('leo-os-tasks', local);
    _recalculateLocalProjectProgress(task.project_id);
    return localTask;
  },

  async updateProjectTask(id: string, updates: Partial<ProjectTask>): Promise<ProjectTask | null> {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('project_tasks')
          .update(updates)
          .eq('id', id)
          .select();
        if (!error && data && data.length > 0) {
          return data[0] as ProjectTask;
        }
      } catch (err) {
        console.error(err);
      }
    }
    
    const local = getLocalData<ProjectTask>('leo-os-tasks', INITIAL_PROJECT_TASKS);
    const idx = local.findIndex(t => t.id === id);
    if (idx !== -1) {
      local[idx] = { ...local[idx], ...updates };
      setLocalData('leo-os-tasks', local);
      _recalculateLocalProjectProgress(local[idx].project_id);
      return local[idx];
    }
    return null;
  },

  async deleteProjectTask(id: string): Promise<void> {
    if (supabase) {
      try {
        await supabase.from('project_tasks').delete().eq('id', id);
        return;
      } catch (err) {
        console.error(err);
      }
    }
    
    const local = getLocalData<ProjectTask>('leo-os-tasks', INITIAL_PROJECT_TASKS);
    const taskToDelete = local.find(t => t.id === id);
    if (taskToDelete) {
      const filtered = local.filter(t => t.id !== id);
      setLocalData('leo-os-tasks', filtered);
      _recalculateLocalProjectProgress(taskToDelete.project_id);
    }
  },

  // --- EMAILS SERVICES ---
  async getEmails(): Promise<EmailAccount[]> {
    if (supabase) {
      try {
        const { data, error } = await withSupabaseTimeout(
          supabase
            .from('emails')
            .select('*')
            .order('created_at', { ascending: true }),
          'emails fetch'
        );
        
        if (!error && data) {
          setLocalData('leo-os-emails', data);
          return data as EmailAccount[];
        }
      } catch (err) {
        console.error(err);
      }
    }
    return getLocalData<EmailAccount>('leo-os-emails', INITIAL_EMAILS);
  },

  async createEmail(email: Omit<EmailAccount, 'id'>): Promise<EmailAccount> {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('emails')
          .insert([email])
          .select();
        if (!error && data && data.length > 0) {
          const created = data[0] as EmailAccount;
          const local = getLocalData<EmailAccount>('leo-os-emails', INITIAL_EMAILS);
          local.push(created);
          setLocalData('leo-os-emails', local);
          return created;
        }
      } catch (err) {
        console.error(err);
      }
    }
    const localEmail = { ...email, id: `e_${Date.now()}` };
    const local = getLocalData<EmailAccount>('leo-os-emails', INITIAL_EMAILS);
    local.push(localEmail);
    setLocalData('leo-os-emails', local);
    return localEmail;
  },

  async updateEmail(id: string, updates: Partial<EmailAccount>): Promise<EmailAccount> {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('emails')
          .update(updates)
          .eq('id', id)
          .select();
        if (!error && data && data.length > 0) {
          const local = getLocalData<EmailAccount>('leo-os-emails', INITIAL_EMAILS);
          const idx = local.findIndex(e => e.id === id);
          if (idx !== -1) {
            local[idx] = { ...local[idx], ...updates };
            setLocalData('leo-os-emails', local);
          }
          return data[0] as EmailAccount;
        }
      } catch (err) {
        console.error('Supabase connection failed during email update:', err);
      }
    }
    const local = getLocalData<EmailAccount>('leo-os-emails', INITIAL_EMAILS);
    const idx = local.findIndex(e => e.id === id);
    if (idx !== -1) {
      local[idx] = { ...local[idx], ...updates };
      setLocalData('leo-os-emails', local);
      return local[idx];
    }
    throw new Error('Email not found');
  },

  async deleteEmail(id: string): Promise<boolean> {
    if (supabase) {
      try {
        const { error } = await supabase
          .from('emails')
          .delete()
          .eq('id', id);
        if (!error) {
          const local = getLocalData<EmailAccount>('leo-os-emails', INITIAL_EMAILS);
          const filtered = local.filter(e => e.id !== id);
          setLocalData('leo-os-emails', filtered);
          return true;
        }
      } catch (err) {
        console.error(err);
      }
    }
    const local = getLocalData<EmailAccount>('leo-os-emails', INITIAL_EMAILS);
    const filtered = local.filter(e => e.id !== id);
    setLocalData('leo-os-emails', filtered);
    return true;
  },

  // --- SOCIAL PROFILES SERVICES ---
  async getSocials(): Promise<SocialProfile[]> {
    if (supabase) {
      try {
        const { data, error } = await withSupabaseTimeout(
          supabase
            .from('social_profiles')
            .select('*')
            .order('created_at', { ascending: true }),
          'social profiles fetch'
        );
        if (!error && data) {
          setLocalData('leo-os-socials', data);
          return data as SocialProfile[];
        }
      } catch (err) {
        console.error(err);
      }
    }
    return getLocalData<SocialProfile>('leo-os-socials', INITIAL_SOCIALS);
  },

  async createSocial(social: Omit<SocialProfile, 'id'>): Promise<SocialProfile> {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('social_profiles')
          .insert([social])
          .select();
        if (!error && data && data.length > 0) {
          const created = data[0] as SocialProfile;
          const local = getLocalData<SocialProfile>('leo-os-socials', INITIAL_SOCIALS);
          local.push(created);
          setLocalData('leo-os-socials', local);
          return created;
        }
      } catch (err) {
        console.error(err);
      }
    }
    const localSocial = { ...social, id: `s_${Date.now()}` };
    const local = getLocalData<SocialProfile>('leo-os-socials', INITIAL_SOCIALS);
    local.push(localSocial);
    setLocalData('leo-os-socials', local);
    return localSocial;
  },

  async updateSocial(id: string, updates: Partial<SocialProfile>): Promise<SocialProfile> {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('social_profiles')
          .update(updates)
          .eq('id', id)
          .select();
        if (!error && data && data.length > 0) {
          const local = getLocalData<SocialProfile>('leo-os-socials', INITIAL_SOCIALS);
          const idx = local.findIndex(s => s.id === id);
          if (idx !== -1) {
            local[idx] = { ...local[idx], ...updates };
            setLocalData('leo-os-socials', local);
          }
          return data[0] as SocialProfile;
        }
      } catch (err) {
        console.error('Supabase connection failed during social update:', err);
      }
    }
    const local = getLocalData<SocialProfile>('leo-os-socials', INITIAL_SOCIALS);
    const idx = local.findIndex(s => s.id === id);
    if (idx !== -1) {
      local[idx] = { ...local[idx], ...updates };
      setLocalData('leo-os-socials', local);
      return local[idx];
    }
    throw new Error('Social not found');
  },

  async deleteSocial(id: string): Promise<boolean> {
    if (supabase) {
      try {
        const { error } = await supabase
          .from('social_profiles')
          .delete()
          .eq('id', id);
        if (!error) {
          const local = getLocalData<SocialProfile>('leo-os-socials', INITIAL_SOCIALS);
          const filtered = local.filter(s => s.id !== id);
          setLocalData('leo-os-socials', filtered);
          return true;
        }
      } catch (err) {
        console.error(err);
      }
    }
    const local = getLocalData<SocialProfile>('leo-os-socials', INITIAL_SOCIALS);
    const filtered = local.filter(s => s.id !== id);
    setLocalData('leo-os-socials', filtered);
    return true;
  },

  // --- SUBSCRIPTIONS SERVICES ---
  async getSubscriptions(): Promise<Subscription[]> {
    if (supabase) {
      try {
        const { data, error } = await withSupabaseTimeout(
          supabase
            .from('subscriptions')
            .select('*')
            .order('created_at', { ascending: true }),
          'subscriptions fetch'
        );
        if (!error && data) {
          // Standardize numeric types from DB
          const parsedData = data.map(sub => ({
            ...sub,
            cost: Number(sub.cost)
          }));
          setLocalData('leo-os-subs', parsedData);
          return parsedData as Subscription[];
        }
      } catch (err) {
        console.error(err);
      }
    }
    return getLocalData<Subscription>('leo-os-subs', INITIAL_SUBSCRIPTIONS);
  },

  async createSubscription(sub: Omit<Subscription, 'id'>): Promise<Subscription> {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('subscriptions')
          .insert([sub])
          .select();
        if (!error && data && data.length > 0) {
          const created = { ...data[0], cost: Number(data[0].cost) } as Subscription;
          const local = getLocalData<Subscription>('leo-os-subs', INITIAL_SUBSCRIPTIONS);
          local.push(created);
          setLocalData('leo-os-subs', local);
          return created;
        }
      } catch (err) {
        console.error(err);
      }
    }
    const localSub = { ...sub, id: `sub_${Date.now()}` };
    const local = getLocalData<Subscription>('leo-os-subs', INITIAL_SUBSCRIPTIONS);
    local.push(localSub);
    setLocalData('leo-os-subs', local);
    return localSub;
  },

  async updateSubscription(id: string, updates: Partial<Subscription>): Promise<Subscription> {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('subscriptions')
          .update(updates)
          .eq('id', id)
          .select();
        if (!error && data && data.length > 0) {
          const updated = { ...data[0], cost: Number(data[0].cost) } as Subscription;
          const local = getLocalData<Subscription>('leo-os-subs', INITIAL_SUBSCRIPTIONS);
          const idx = local.findIndex(s => s.id === id);
          if (idx !== -1) {
            local[idx] = updated;
            setLocalData('leo-os-subs', local);
          }
          return updated;
        }
      } catch (err) {
        console.error('Supabase connection failed during subscription update:', err);
      }
    }
    const local = getLocalData<Subscription>('leo-os-subs', INITIAL_SUBSCRIPTIONS);
    const idx = local.findIndex(s => s.id === id);
    if (idx !== -1) {
      local[idx] = { ...local[idx], ...updates };
      setLocalData('leo-os-subs', local);
      return local[idx];
    }
    throw new Error('Subscription not found');
  },

  async deleteSubscription(id: string): Promise<boolean> {
    if (supabase) {
      try {
        const { error } = await supabase
          .from('subscriptions')
          .delete()
          .eq('id', id);
        if (!error) {
          const local = getLocalData<Subscription>('leo-os-subs', INITIAL_SUBSCRIPTIONS);
          const filtered = local.filter(s => s.id !== id);
          setLocalData('leo-os-subs', filtered);
          return true;
        }
      } catch (err) {
        console.error(err);
      }
    }
    const local = getLocalData<Subscription>('leo-os-subs', INITIAL_SUBSCRIPTIONS);
    const filtered = local.filter(s => s.id !== id);
    setLocalData('leo-os-subs', filtered);
    return true;
  },

  // --- AGENT LOGS SERVICES ---
  async getAgentLogs(): Promise<AgentLogEntry[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('agent_logs')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && data) {
          setLocalData('leo-os-agent-logs', data);
          return data as AgentLogEntry[];
        }
        console.warn('Supabase logs fetch error, falling back:', error);
      } catch (err) {
        console.error(err);
      }
    }
    return getLocalData<AgentLogEntry>('leo-os-agent-logs', INITIAL_AGENT_LOGS);
  },

  async clearAgentLogs(): Promise<boolean> {
    if (supabase) {
      try {
        const { error } = await supabase
          .from('agent_logs')
          .delete()
          .neq('id', '00000000-0000-0000-0000-000000000000'); // delete all
        if (!error) {
          setLocalData('leo-os-agent-logs', []);
          return true;
        }
        console.error('Failed to clear Supabase agent logs:', error);
      } catch (err) {
        console.error(err);
      }
    }
    setLocalData('leo-os-agent-logs', []);
    return true;
  },

  // --- NOTIFICATIONS SERVICES ---
  async getNotifications(): Promise<AppNotification[]> {
    if (supabase) {
      try {
        const { data, error } = await withSupabaseTimeout(
          supabase
            .from('notifications')
            .select('*')
            .order('created_at', { ascending: false }),
          'notifications fetch'
        );
        if (!error && data) {
          setLocalData('leo-os-notifications', data);
          return data as AppNotification[];
        }
      } catch (err) {
        console.error(err);
      }
    }
    return getLocalData<AppNotification>('leo-os-notifications', INITIAL_NOTIFICATIONS);
  },


  async markNotificationAsRead(id: string): Promise<void> {
    if (supabase) {
      try {
        await supabase
          .from('notifications')
          .update({ read: true })
          .eq('id', id);
      } catch (err) {
        console.error(err);
      }
    }
    const local = getLocalData<AppNotification>('leo-os-notifications', INITIAL_NOTIFICATIONS);
    const idx = local.findIndex(n => n.id === id);
    if (idx !== -1) {
      local[idx].read = true;
      setLocalData('leo-os-notifications', local);
    }
  },

  async createNotification(notification: Omit<AppNotification, 'id' | 'created_at' | 'read'>): Promise<AppNotification | null> {
    const newNotif = {
      ...notification,
      read: false
    };

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('notifications')
          .insert([newNotif])
          .select();
        if (!error && data && data.length > 0) {
          return data[0] as AppNotification;
        }
      } catch (err) {
        console.error(err);
      }
    }
    
    const localNotif: AppNotification = { 
      ...newNotif, 
      id: `n_${Date.now()}`, 
      created_at: new Date().toISOString() 
    };
    const local = getLocalData<AppNotification>('leo-os-notifications', INITIAL_NOTIFICATIONS);
    local.unshift(localNotif);
    setLocalData('leo-os-notifications', local);

    if (isBrowser) {
      window.dispatchEvent(new Event('local-db-changed'));
      window.dispatchEvent(new CustomEvent('local-notification-created', { detail: localNotif }));
    }

    return localNotif;
  },

  // --- AGENTS SERVICES ---
  async getAgents(): Promise<Agent[]> {
    if (supabase) {
      try {
        const { data, error } = await withSupabaseTimeout(
          supabase
            .from('agents')
            .select('*')
            .order('created_at', { ascending: false }),
          'agents fetch'
        );
        if (!error && data) {
          setLocalData('leo-os-agents', data);
          return data as Agent[];
        }
      } catch (err) {
        console.error(err);
      }
    }
    return getLocalData<Agent>('leo-os-agents', []);
  },

  async createAgent(agent: Omit<Agent, 'id' | 'created_at'>): Promise<Agent | null> {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('agents')
          .insert([agent])
          .select();
        
        if (!error && data && data.length > 0) {
          const created = data[0] as Agent;
          const local = getLocalData<Agent>('leo-os-agents', []);
          local.unshift(created);
          setLocalData('leo-os-agents', local);
          
          // Log creation via the unified service
          await this.createAgentLog({
            level: 'system',
            component: 'AgentBuilder',
            message: `Nuevo agente instanciado: ${agent.name} (${agent.role})`
          });
          
          return created;
        }
      } catch (err) {
        console.error(err);
      }
    }
    
    // Local fallback
    const localAgent: Agent = { 
      ...agent, 
      id: `a_${Date.now()}`, 
      created_at: new Date().toISOString() 
    };
    const local = getLocalData<Agent>('leo-os-agents', []);
    local.unshift(localAgent);
    setLocalData('leo-os-agents', local);
    return localAgent;
  },

  async updateAgent(id: string, updates: Partial<Agent>): Promise<Agent> {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('agents')
          .update(updates)
          .eq('id', id)
          .select();
        
        if (!error && data && data.length > 0) {
          const local = getLocalData<Agent>('leo-os-agents', []);
          const idx = local.findIndex(a => a.id === id);
          if (idx !== -1) {
            local[idx] = data[0] as Agent;
            setLocalData('leo-os-agents', local);
          }
          return data[0] as Agent;
        }
      } catch (err) {
        console.error(err);
      }
    }
    const local = getLocalData<Agent>('leo-os-agents', []);
    const idx = local.findIndex(a => a.id === id);
    if (idx !== -1) {
      local[idx] = { ...local[idx], ...updates };
      setLocalData('leo-os-agents', local);
      return local[idx];
    }
    throw new Error('Agent not found');
  },

  async deleteAgent(id: string): Promise<boolean> {
    if (supabase) {
      try {
        const { error } = await supabase.from('agents').delete().eq('id', id);
        if (!error) {
          const local = getLocalData<Agent>('leo-os-agents', []);
          setLocalData('leo-os-agents', local.filter(a => a.id !== id));
          return true;
        }
      } catch (err) {
        console.error(err);
      }
    }
    const local = getLocalData<Agent>('leo-os-agents', []);
    setLocalData('leo-os-agents', local.filter(a => a.id !== id));
    return true;
  },

  // Helper inside dbService to create logs properly
  async createAgentLog(log: Omit<AgentLogEntry, 'id' | 'created_at'>): Promise<void> {
    if (supabase) {
      try {
        await supabase.from('agent_logs').insert([log]);
        return;
      } catch (err) {
        console.error(err);
      }
    }
    const localLog: AgentLogEntry = {
      ...log,
      id: `l_${Date.now()}`,
      created_at: new Date().toISOString()
    };
    const local = getLocalData<AgentLogEntry>('leo-os-agent-logs', []);
    local.unshift(localLog);
    setLocalData('leo-os-agent-logs', local);
  }
};
