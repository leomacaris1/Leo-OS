import { createClient } from '@supabase/supabase-js';

// Define types for TypeScript safety
export interface Project {
  id: string;
  name: string;
  status: 'Active' | 'In Progress' | 'Completed' | 'On Hold';
  progress: number;
  tech_stack: string[];
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
  created_at?: string;
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
  { id: 'p1', name: 'Leo Portfolio', status: 'Completed', progress: 100, tech_stack: ['Next.js', 'React', 'Tailwind CSS', 'Vercel'] },
  { id: 'p2', name: 'OmniAgent', status: 'In Progress', progress: 90, tech_stack: ['Python', 'LangChain', 'FastAPI', 'OpenAI'] },
  { id: 'p3', name: 'CoreOps', status: 'Completed', progress: 100, tech_stack: ['Go', 'Docker', 'Kubernetes', 'gRPC'] },
  { id: 'p4', name: 'MoneyFlow', status: 'In Progress', progress: 85, tech_stack: ['TypeScript', 'React', 'Supabase', 'Stripe'] },
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
  { id: 'sub1', name: 'ChatGPT Plus', cost: 20.00, billing_cycle: 'Monthly', status: 'Active' },
  { id: 'sub2', name: 'Netflix Premium', cost: 15.49, billing_cycle: 'Monthly', status: 'Active' },
  { id: 'sub3', name: 'Spotify Family', cost: 10.99, billing_cycle: 'Monthly', status: 'Active' },
  { id: 'sub4', name: 'GitHub Copilot', cost: 10.00, billing_cycle: 'Monthly', status: 'Active' },
  { id: 'sub5', name: 'Vercel Pro', cost: 20.00, billing_cycle: 'Monthly', status: 'Active' },
];

// Helper to check if a value is in client-side context (browsers)
const isBrowser = typeof window !== 'undefined';

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

// Unified DB Service providing simple CRUD functionality
export const dbService = {
  // --- PROJECTS SERVICES ---
  async getProjects(): Promise<Project[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: true });
        
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

  // --- EMAILS SERVICES ---
  async getEmails(): Promise<EmailAccount[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('emails')
          .select('*')
          .order('created_at', { ascending: true });
        
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
        const { data, error } = await supabase
          .from('social_profiles')
          .select('*')
          .order('created_at', { ascending: true });
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
        const { data, error } = await supabase
          .from('subscriptions')
          .select('*')
          .order('created_at', { ascending: true });
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
  }
};
