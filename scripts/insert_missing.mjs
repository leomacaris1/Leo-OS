import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Apuntando al .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const MISSING_PROJECTS = [
  {
    name: 'Leo OS',
    status: 'Completed',
    progress: 100,
    tech_stack: ['Next.js', 'React', 'Tailwind CSS', 'Vercel', 'Supabase'],
    description: 'Sistema Operativo Personal y Dashboard de Telemetría.',
  },
  {
    name: 'Fábrica de Productos',
    status: 'In Progress',
    progress: 35,
    tech_stack: ['React', 'Vite', 'Node.js', 'Supabase', 'Stripe'],
    description: 'Sistema base y motor de creación de productos digitales escalables.',
  },
  {
    name: 'Digital Business',
    status: 'On Hold',
    progress: 40,
    tech_stack: ['Next.js', 'Tailwind CSS', 'Supabase', 'Analytics'],
    description: 'Ecosistema de negocios digitales y embudos de venta.',
  }
];

async function seed() {
  console.log('Insertando proyectos faltantes en Supabase...');
  const { data, error } = await supabase
    .from('projects')
    .upsert(MISSING_PROJECTS, { onConflict: 'name' })
    .select();
  
  if (error) {
    console.error('Error insertando proyectos:', error);
  } else {
    console.log('✅ Proyectos insertados exitosamente:', data.map(d => d.name).join(', '));
  }
}

seed();
