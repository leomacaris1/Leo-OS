# ng-rules.md — Cosas Prohibidas

Lista de "no hagas esto". Si algo de aquí aparece en una propuesta o un diff, se rechaza antes de seguir.

## Datos

- NO llamar a `createClient` de Supabase directamente desde un componente de `src/components/`. Todo pasa por `dbService` en `src/lib/supabase.ts`.
- NO añadir una tabla nueva sin su interfaz TypeScript y sus métodos CRUD correspondientes en `dbService`.
- NO escribir migraciones SQL no idempotentes (siempre `IF NOT EXISTS` / `IF EXISTS`).

## UI / Estética

- NO usar `bg-white` ni fondos claros como color principal de un panel — rompe la estética cyberpunk neon-dark.
- NO dejar un `<button>`, `<a>`, `<select>` o `<input>` solo-ícono sin `title` o `aria-label`.
- NO usar estilos en línea (`style={{...}}`) salvo que el valor sea verdaderamente dinámico (ej. un color calculado en runtime). Si es estático, va en una clase de Tailwind.
- NO introducir una paleta de color nueva sin pasar por `skills/leo-os-ui-patterns.md` primero.

## Código

- NO mutar estado de React directamente; usa los setters (`setX(prev => ...)`).
- NO dejar una operación a Supabase sin `try/catch` que contemple la caída a Local Cache Mirror.
- NO crear abstracciones (hooks genéricos, wrappers) para un solo uso. Tres líneas repetidas son mejores que una abstracción prematura.

## Proceso

- NO mezclar una migración de esquema con un cambio de UI no relacionado en el mismo PR/commit.
- NO marcar una tarea de auditoría (`project_tasks`) como completa sin que el código correspondiente exista en el repo.
