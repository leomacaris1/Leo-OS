# stack.md — Stack y Decisiones de Arquitectura

Contexto técnico fijo del proyecto, para no tener que re-explicarlo en cada conversación.

## Stack

- **Framework:** Next.js 15.5.18, App Router.
- **UI:** React 18, TypeScript 5, Tailwind CSS 3.4.
- **Datos:** Supabase (`@supabase/supabase-js`), con fallback automático a `localStorage` ("Local Cache Mirror") si no hay variables de entorno configuradas.
- **Gráficos:** Recharts.
- **Iconos:** lucide-react.
- **Notificaciones UI:** sonner (toasts).
- **Tests:** Playwright (`@playwright/test`).
- **Deploy:** Vercel.

## Estructura de carpetas

```
agents/        # roles del agente (planner, db-architect, code-reviewer)
skills/        # reglas técnicas obligatorias (UI patterns, CRUD ops)
src/app/       # rutas y layout de Next.js
src/components/# componentes React de la app
src/lib/       # cliente de datos (dbService)
*.sql          # migraciones versionadas (migration_vN_*.sql)
```

## Decisiones de arquitectura ya tomadas

- **Espejo de caché local en vez de error duro:** si no hay credenciales de Supabase, la app sigue siendo usable contra `localStorage`. No "arreglar" esto quitando el fallback.
- **Acceso a datos centralizado en `dbService`:** decisión deliberada para poder cambiar el backend sin tocar componentes.
- **Migraciones versionadas y aditivas:** nunca se reescribe `supabase_schema.sql`; los cambios van en `migration_vN_*.sql` nuevos.
- **Tablas activas:** `projects`, `project_tasks`, `emails`, `social_profiles`, `subscriptions`, `agent_logs`, `notifications`.
- **Integración con OmniAgent:** vía webhook `POST /api/webhooks/nexus`, autenticado con `NEXUS_WEBHOOK_SECRET` / `OMNIAGENT_NEXUS_WEBHOOK_SECRET`.

## Variables de entorno relevantes

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
NEXUS_WEBHOOK_SECRET
```
