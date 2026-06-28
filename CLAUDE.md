# CLAUDE.md — Reglas Generales de Leo-OS

Este archivo es la base de todas las acciones del agente en este repositorio. Léelo antes de tocar cualquier código.

## Qué es Leo-OS

Dashboard personal de gestión y telemetría con estética cyberpunk. Next.js 15 (App Router), React 18, TypeScript, Tailwind CSS 3, Supabase (con fallback a `localStorage` como "Local Cache Mirror"), Recharts para gráficos.

## Stack y convenciones (resumen — detalle en `stack.md`)

- App Router de Next.js: páginas y layouts en `src/app/`, componentes en `src/components/`, acceso a datos en `src/lib/supabase.ts`.
- Todo acceso a datos pasa por `dbService` (`src/lib/supabase.ts`). Nunca se llama a Supabase directamente desde un componente — ver `ng-rules.md`.
- Estética obligatoria: glassmorphism cyberpunk neon-dark (slate/cyan/emerald). Detalle completo en `skills/leo-os-ui-patterns.md`.

## Ecosistema de agentes y skills

- `agents/`: roles que un agente puede adoptar (`planner.md`, `db-architect.md`, `code-reviewer.md`).
- `skills/`: reglas técnicas obligatorias (`supabase-crud-ops.md`, `leo-os-ui-patterns.md`).
- Estos 7 archivos de raíz (`CLAUDE.md`, `persona.md`, `lessons.md`, `references.md`, `ng-rules.md`, `stack.md`, `glossary.md`) son el contexto permanente que se carga siempre, independientemente del rol que se adopte.

## Orden de prioridad si hay conflicto

1. Instrucción explícita del usuario en la conversación actual.
2. `ng-rules.md` (prohibiciones duras).
3. El rol activo en `agents/` + la skill relevante en `skills/`.
4. Este archivo y el resto del contexto raíz.

## Antes de proponer cambios

- Revisa `lessons.md` para no repetir errores ya registrados.
- Revisa `references.md` si la tarea se parece a algo ya construido.
- Usa los términos de `glossary.md` tal cual están definidos, no inventes sinónimos.
