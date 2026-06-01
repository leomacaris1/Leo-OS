import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const INITIAL_PROJECTS = [
  {
    name: 'mm-nexus-hub',
    status: 'Full Green',
    progress: 95,
    tech_stack: ['Next.js', 'React', 'Tailwind CSS', 'Vercel', 'Supabase'],
    description: 'Hub central del ecosistema M&M Nexus.',
  },
  {
    name: 'OmniAgent v7.0',
    status: 'Conectando LLM',
    progress: 85,
    tech_stack: ['Python', 'LangChain', 'FastAPI', 'OpenAI', 'GPT-4'],
    description: 'Agente autónomo de IA con capacidad multi-modelo.',
  },
  {
    name: 'CoreOps',
    status: 'En Producción',
    progress: 90,
    tech_stack: ['Go', 'Docker', 'Kubernetes', 'gRPC', 'Terraform'],
    description: 'Infraestructura core de operaciones.',
  },
  {
    name: 'MoneyFlow Pro',
    status: 'MVP Funcional',
    progress: 80,
    tech_stack: ['TypeScript', 'React', 'Supabase', 'Stripe', 'Recharts'],
    description: 'Plataforma de gestión financiera personal.',
  },
  {
    name: 'Fabrica de Productos',
    status: 'Motor Activo',
    progress: 35,
    tech_stack: ['React', 'Node.js', 'Supabase', 'Stripe'],
    description: 'Sistema de productos digitales escalables.',
  },
  {
    name: 'Digital Business',
    status: 'Estrategia',
    progress: 40,
    tech_stack: ['Next.js', 'Tailwind CSS', 'Supabase', 'Analytics'],
    description: 'Ecosistema de negocios digitales.',
  }
];

async function seed() {
  console.log('Seeding projects...');
  const { data, error } = await supabase
    .from('projects')
    .insert(INITIAL_PROJECTS)
    .select();

  if (error) {
    console.error('Error inserting projects:', error);
  } else {
    console.log('Successfully inserted', data.length, 'projects.');
  }
}

seed();
