---
name: supabase-crud-ops
description: Operaciones de base de datos híbrida para Leo-OS.
version: 1.0.0
---

# Habilidad: Supabase CRUD Ops (Leo-OS)

Esta habilidad documenta cómo conectarse a los datos de la aplicación. Leo-OS tiene un "Espejo de Caché Local", lo que significa que el código nunca debe usar el SDK oficial puro `createClient` directamente dentro de los componentes, sino consumir los servicios a través de `src/lib/supabase.ts`.

## 1. El Cliente Híbrido (`dbService`)
Todas las operaciones de la base de datos se manejan exportando un objeto `dbService` desde `src/lib/supabase.ts`. 

Este servicio tiene métodos estandarizados como:
- `dbService.getProjects()`
- `dbService.upsertProject(project)`
- `dbService.getProjectTasks(projectId)`
- `dbService.upsertProjectTask(task)`

## 2. Regla de Agregación de Métodos
Si como Agente necesitas añadir una tabla nueva (ej. `notes`), NO llames a Supabase directamente en la UI.
**Paso correcto:**
1. Ve a `src/lib/supabase.ts`.
2. Añade la interfaz de TypeScript correspondiente (ej. `export interface Note { id: string, content: string }`).
3. Añade los métodos CRUD al objeto `dbService` (ej. `getNotes: async () => { ... }`, encapsulando tanto la lógica de Supabase real como el fallback al `localStorage`).
4. Luego, llama a `dbService.getNotes()` desde el componente React.

## 3. Estado en los Componentes
El frontend maneja el estado localmente asumiendo que las operaciones de Supabase funcionan.
Usa este patrón en tus funciones de evento de React:
```tsx
const handleSave = async () => {
  try {
    // 1. Llamar al servicio
    await dbService.upsertEntity(myEntity);
    // 2. Actualizar estado local si fue exitoso
    setEntities(prev => prev.map(e => e.id === myEntity.id ? myEntity : e));
  } catch (error) {
    // Manejo de errores silencioso o toast
    console.error("Error guardando:", error);
  }
}
```
