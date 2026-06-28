# references.md — Ejemplos de Referencia

Modelos a imitar cuando se pide "haz algo como esto". Apunta siempre a archivos reales del repo, no a descripciones abstractas.

## Componente con estado + Supabase híbrido

`src/components/Dashboard.tsx` — gestión, creación y edición en caliente de proyectos, con badges de estado por emoji. Es la referencia para cualquier vista CRUD nueva.

## Módulo con gráficos y cálculos derivados

`src/components/CommandCenter.tsx` — usa Recharts para desglosar costos, incluye una calculadora de conversión en tiempo real. Referencia para cualquier panel con analítica o cálculos en vivo.

## Consola interactiva con comandos

`src/components/AgentLog.tsx` — implementa `/help`, `/scan`, `/status`, `/clear`. Referencia si se pide agregar comandos nuevos a una terminal o input tipo CLI.

## Cliente de datos híbrido

`src/lib/supabase.ts` — patrón `dbService` con fallback a `localStorage`. Toda tabla nueva sigue el mismo molde: interfaz TypeScript + métodos CRUD encapsulados aquí, nunca llamadas directas desde componentes.

## Migración de base de datos

`migration_v4_tasks.sql` — ejemplo de migración idempotente (`IF NOT EXISTS`) que añade una tabla nueva ligada a `projects`. Referencia para cualquier `migration_vN_*.sql` nuevo.

## Webhook externo

`POST /api/webhooks/nexus` (ver README, sección Nexus) — referencia para cualquier endpoint que reciba telemetría externa y la escriba en `agent_logs` / `notifications`.
