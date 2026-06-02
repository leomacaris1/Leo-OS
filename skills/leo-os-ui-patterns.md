---
name: leo-os-ui-patterns
description: Patrones de diseño de interfaz de usuario para Leo-OS.
version: 1.0.0
---

# Habilidad: UI Patterns (Leo-OS)

Esta habilidad proporciona el marco de diseño estético que TODO componente de Leo-OS debe seguir para mantener la consistencia "Cyberpunk Premium".

## 1. Reglas de Contenedores y Glassmorphism

Todo panel secundario, tarjeta o modal debe implementar glassmorphism con estos tokens de Tailwind:

```html
<div
  className="bg-slate-900/60 backdrop-blur-md border border-slate-800/50 rounded-2xl p-6 shadow-2xl"
>
  <!-- Contenido -->
</div>
```

- No uses `bg-white` ni colores claros como fondos principales.

## 2. Tipografía y Textos

- **Títulos:** Deben ser blancos o `slate-200` con `font-semibold` o `font-bold`. Opcionalmente, pueden tener tracking: `tracking-tight`.
- **Subtítulos/Métricas Secundarias:** `text-slate-400` o `text-slate-500`.
- **Números Importantes:** Utiliza fuentes monoespaciadas si aplica: `font-mono`.

## 3. Acentos de Color (Neón)

Los botones de acción principales y los estados deben usar gradientes o glows.

- **Acción Principal:** `bg-cyan-500 hover:bg-cyan-400 text-slate-950`
- **Peligro / Destructivo:** `text-rose-400 hover:text-rose-300` o fondos con `rose-500`.
- **Acentos Sutiles (Bordes interactivos):** `focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50`

## 4. Animaciones y Micro-Interacciones

Cualquier elemento interactivo debe reaccionar.

- Botones: Siempre añade `transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]`.
- Enlaces y Hover states en listas: `hover:bg-slate-800/50`.

## 5. Accesibilidad Obligatoria

Cualquier `<button>`, `<a>`, `<select>` o `<input>` que solo tenga un icono (sin texto visible) DEBE llevar el atributo `title` o `aria-label`.
Ejemplo:

```tsx
<button title="Cerrar panel" className="...">
  {" "}
  <X />{" "}
</button>
```
