# 🌌 Leo OS — Personal Management Dashboard & Telemetry Center

[![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38bdf8?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3ecf8e?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployment-black?style=for-the-badge&logo=vercel&logoColor=white)](https://leo-os-nu.vercel.app/)

**Un centro de operaciones personal, telemetría y control interactivo con estética cyberpunk y diseño ultra-premium.**

> _Nota: Inserta aquí tu GIF o Screenshot principal de la interfaz (`![Dashboard Preview](./docs/preview.gif)`)_

[✨ Demo En Vivo](https://leo-os-nu.vercel.app/) • [📂 Estructura](#-arquitectura-y-estructura-del-proyecto) • [🛠️ Instalación](#-guía-de-instalación-y-uso) • [☁️ Configuración de Supabase](#-sincronización-con-supabase)

---

## 📖 Descripción General

**Leo OS** es un dashboard administrativo interactivo de alto rendimiento y fidelidad visual, diseñado bajo un esquema híbrido de bases de datos. Ofrece una vista consolidada sobre proyectos activos, logs de ejecución de agentes autónomos, y un centro financiero de suscripciones y conversión de monedas en tiempo real.

Todo esto está envuelto en una interfaz con estilo _cyberpunk neon-dark_, efectos _glassmorphism_, sutiles micro-animaciones en hover y transiciones fluidas que garantizan una experiencia de usuario sobresaliente.

---

## ⚡ Características Principales

### 🌌 1. Estética Cyberpunk Premium

- Fondos oscuros profundos con gradientes radiales reactivos.
- Bordes semitransparentes con efectos de desenfoque de fondo (_backdrop-filter_).
- Sombras neón y glows vibrantes que responden a las interacciones del cursor.
- Tipografía premium integrada usando fuentes modernas optimizadas.

### 📊 2. Telemetría de Proyectos (Integración de Auditoría Real)

- Grid interactivo de proyectos activos con barras de progreso dinámicas.
- **Badges de estado autodetectados mediante emojis** (`🟢`, `🟡`, `🔵`, `🟣`) para renderizar paletas de color neón adaptativas.
- Sistema de creación y edición en caliente con campos de texto de libre formato.
- Inclusión de la columna `description` para dar contexto a los desarrollos y auditorías activas.

### 💻 3. Terminal del Agente (AgentLog)

- Consola interactiva animada con simulación en tiempo real de escaneo de espacio de trabajo.
- Ejecutor de comandos integrados en la consola:
  - `/help` — Despliega los comandos disponibles.
  - `/scan` — Inicia un diagnóstico simulado de la integridad del repositorio.
  - `/status` — Imprime el reporte de conexión actual de la base de datos.
  - `/clear` — Limpia el historial de la pantalla de terminal.

### 💳 4. Centro de Control Financiero (Command Center)

- **Gestión de Identidad**: Edición instantánea de perfiles y portales sociales.
- **Control de Costos Mensuales**: Tabla interactiva de suscripciones registradas.
- **Analytics Visuales**: Gráfico de barras interactivo generado con **Recharts** que desglosa el costo mensual por servicio.
- **Calculadora de Costos**: Herramienta de conversión en tiempo real con selectores de tipo de cambio y proyecciones de gasto anuales.

---

## 🛠️ Arquitectura y Estructura del Proyecto

La estructura del código sigue los estándares de **Next.js App Router** y componentes altamente cohesivos:

```bash
Leo OS/
├── agents/                  # Cerebros de OmniAgent (Planner, Reviewer, Architect).
├── skills/                  # Habilidades de OmniAgent (UI Patterns, DB Ops).
├── src/
│   ├── app/
│   │   ├── globals.css      # Sistema de diseño, animaciones y tokens neón CSS.
│   │   ├── layout.tsx       # Estructura del documento y optimización de tipografía.
│   │   └── page.tsx         # Coordinador principal de la SPA y estados de carga.
│   ├── components/
│   │   ├── AgentLog.tsx     # Consola interactiva y lógica del simulador de comandos.
│   │   ├── CommandCenter.tsx# Módulo financiero, Recharts y calculadoras dinámicas.
│   │   ├── Dashboard.tsx    # Gestión, creación, edición y badges de proyectos.
│   │   └── Sidebar.tsx      # Navegación del sistema y widgets de telemetría.
│   └── lib/
│       └── supabase.ts      # Cliente Supabase híbrido (Cloud ↔ LocalCache Mirror).
├── supabase_schema.sql      # Esquema SQL base y semilla (Seed Data) para Supabase.
├── migration_v2_audit.sql   # Script SQL v2 para habilitar descripción y estados libres.
├── migration_v4_tasks.sql   # Script SQL v4 para habilitar el sistema de auditoría dinámica.
└── README.md                # Esta documentación.
```

### 🗄️ Esquema de Base de Datos

El sistema utiliza múltiples tablas en Supabase para mantener los dominios separados y extensibles:

- **`projects`**: Almacena los proyectos activos, estado, stack de tecnologías y URLs (repositorio y live).
- **`project_tasks`**: Sistema de auditoría vinculado a cada proyecto. Contiene una lista de verificación que calcula automáticamente el progreso del proyecto general.
- **`emails`**: Gestión de cuentas de correo vinculadas a la identidad digital.
- **`social_profiles`**: Identidad de marca personal y redes.
- **`subscriptions`**: Motor financiero que rastrea costos de servicios, periodos de facturación y fechas de renovación.

---

## 🛠️ Guía de Instalación y Uso

Sigue estos sencillos pasos para iniciar y probar **Leo OS** de manera local:

### 1. Clonar el repositorio

```bash
git clone https://github.com/leomacaris1/Leo-OS.git
cd "Leo OS"
```

### 2. Instalar dependencias

Asegúrate de tener **Node.js (v18 o superior recomendada)** instalado. Ejecuta en tu terminal:

```bash
npm install
```

### 3. Ejecutar el servidor de desarrollo

```bash
npm run dev
```

Abre tu navegador en [http://localhost:3000](http://localhost:3000) para ver tu nuevo sistema operativo personal ejecutándose en vivo.

### 4. Compilar para Producción

Para validar los tipos, consistencia y optimizaciones estáticas:

```bash
npm run build
```

### 5. Scripts Útiles Adicionales

- `npm run lint`: Ejecuta el linter estático para detectar problemas de código.
- `node scripts/seed_projects.mjs`: Útil para popular (seed) tu base de datos Supabase rápidamente una vez configurada tu cuenta.

---

## 🤖 Integración con OmniAgent (Arquitectura ECC)

Leo-OS está diseñado para ser co-desarrollado con agentes de inteligencia artificial (como **OmniAgent v7.0**) siguiendo la filosofía **ECC (Everything Claude Code)**. En la raíz del proyecto encontrarás dos carpetas fundamentales:

- `agents/`: Contiene los "cerebros" o System Prompts para que tu agente adopte roles específicos (ej. `planner.md` para planificar, `code-reviewer.md` para auditar, `db-architect.md` para base de datos).
- `skills/`: Contiene las habilidades y reglas estrictas del ecosistema (ej. `leo-os-ui-patterns.md` obliga al agente a usar Glassmorphism y Tailwind correctamente).

**¿Cómo usarlo?**
Cuando interactúes con tu IA en este repositorio, simplemente indícale:

> _"Actúa como el rol definido en `agents/code-reviewer.md` y utiliza la habilidad `skills/leo-os-ui-patterns.md` para revisar el archivo X."_

---

## ☁️ Sincronización con Supabase

**Leo OS** es inteligente: si detecta las variables de entorno se conectará a tu base de datos en la nube. De lo contrario, activará un **Espejo de Caché Local** (`localStorage`) precargado para que la app sea funcional de inmediato.

Para conectarla a tu nube:

### 1. Ejecutar las Migraciones en Supabase

1. Ingresa a tu panel en [Supabase](https://supabase.com).
2. Dirígete a la pestaña **SQL Editor**.
3. Ejecuta primero los contenidos del esquema base: `supabase_schema.sql`.
4. Luego, ejecuta en orden las migraciones: `migration_v2_audit.sql`, `migration_v3.sql`, `migration_v4_tasks.sql`, `migration_v5_agents.sql`, `agent_logs_schema.sql`, `notifications_schema.sql` y finalmente `migration_v6_lock_down_writes.sql`.
5. **Importante:** `migration_v6_lock_down_writes.sql` cierra el acceso de escritura/borrado público a todas las tablas (antes cualquiera con la anon key pública podía escribir o borrar tus datos). Tras aplicarla, todas las escrituras de la app pasan por las rutas server-side `/api/db/[table]`, que usan `SUPABASE_SERVICE_ROLE_KEY`. Asegúrate de definir esa variable de entorno (ver más abajo) antes de aplicar esta migración, o las creaciones/ediciones desde la UI dejarán de persistir en la nube.

### 2. Configurar Variables de Entorno

Crea un archivo `.env.local` en la raíz de tu proyecto local con el siguiente formato:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-de-acceso-publico
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key-solo-en-servidor
NEXUS_WEBHOOK_SECRET=un-secreto-largo-para-omniagent
```

### 3. Reiniciar el Servidor

Reinicia el servidor de desarrollo (`npm run dev`). La etiqueta en la parte superior derecha de tu app cambiará automáticamente de **LOCAL CACHE MIRROR** a **SUPABASE CLOUD ACTIVE**. ¡Todas tus creaciones, modificaciones e interacciones se guardarán ahora en tiempo real en la nube!

### 4. Conectar OmniAgent al Webhook Nexus

Leo OS expone `POST /api/webhooks/nexus` para recibir telemetría real de OmniAgent y guardarla en `agent_logs`. Si incluyes `notify: true` o `event: "notification"`, también creará una notificación en `notifications`.

Configura OmniAgent con:

```env
OMNIAGENT_SUPABASE_ENABLED=true
OMNIAGENT_NEXUS_WEBHOOK_URL=http://localhost:3000/api/webhooks/nexus
OMNIAGENT_NEXUS_WEBHOOK_SECRET=el-mismo-secreto-de-nexus
```

Ejemplo de payload:

```json
{
  "event": "log",
  "level": "SUCCESS",
  "component": "Brain",
  "message": "Ciclo de razonamiento completado.",
  "source": "omniagent"
}
```

---

Desarrollado con pasión para consolidar el control sobre proyectos digitales de forma inteligente. 🌌
