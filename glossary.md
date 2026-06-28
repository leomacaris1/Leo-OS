# glossary.md — Glosario

Palabras de este proyecto. Úsalas tal cual; no inventes sinónimos.

- **Leo-OS** — el dashboard personal en sí; este repositorio.
- **OmniAgent** — el agente de IA que co-desarrolla Leo-OS adoptando los roles definidos en `agents/`.
- **ECC (Everything Claude Code)** — la filosofía de desarrollo del proyecto: todo flujo de trabajo pasa por interactuar con un agente de IA usando los archivos de contexto del repo (`agents/`, `skills/`, y estos 7 archivos de raíz).
- **dbService** — el objeto exportado por `src/lib/supabase.ts` que centraliza todo acceso a datos (real o en caché).
- **Local Cache Mirror** — modo de respaldo en `localStorage` que se activa automáticamente si no hay credenciales de Supabase configuradas. Visible en la UI como etiqueta "LOCAL CACHE MIRROR" vs "SUPABASE CLOUD ACTIVE".
- **Nexus** — el webhook (`/api/webhooks/nexus`) por el que OmniAgent envía telemetría real (logs, notificaciones) hacia Leo-OS.
- **agent_logs** — tabla donde se guarda la telemetría recibida desde Nexus.
- **project_tasks** — tabla de auditoría/checklist vinculada a cada proyecto; calcula el progreso general.
- **Cyberpunk Neon-Dark** — la directriz estética obligatoria del proyecto: glassmorphism, fondos oscuros, glows neón en cyan/emerald/rose. Definida en detalle en `skills/leo-os-ui-patterns.md`.
- **Badge de estado** — emoji (`🟢`, `🟡`, `🔵`, `🟣`) que indica el estado de un proyecto y dispara una paleta de color asociada.
- **Skill** — archivo en `skills/` que documenta una regla técnica obligatoria (no un rol, sino una capacidad/restricción transversal).
- **Rol / Agent** — archivo en `agents/` que define una personalidad y responsabilidades específicas que OmniAgent puede adoptar (Planner, DB Architect, Code Reviewer).
