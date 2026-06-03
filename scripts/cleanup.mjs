import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const PROJECTS_TO_DELETE = [
  'mm-nexus-hub',         // Duplicado de mmnexus-hub
  'MoneyFlow',            // Duplicado de MoneyFlow Pro
  'OmniAgent',            // Duplicado de OmniAgent v7.0
  'Fabrica de Productos'  // Duplicado de Fábrica de Productos (sin tilde)
];

async function cleanup() {
  console.log('Limpiando proyectos duplicados en Supabase...');
  
  const { data, error } = await supabase
    .from('projects')
    .delete()
    .in('name', PROJECTS_TO_DELETE)
    .select();
  
  if (error) {
    console.error('Error eliminando duplicados:', error);
  } else {
    console.log('✅ Duplicados eliminados exitosamente:', data.map(d => d.name));
  }
}

cleanup();
