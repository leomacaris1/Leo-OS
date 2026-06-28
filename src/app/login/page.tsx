'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setError(data.error ?? 'No se pudo iniciar sesión');
        setIsSubmitting(false);
        return;
      }

      const next = searchParams.get('next') || '/';
      router.push(next);
      router.refresh();
    } catch {
      setError('No se pudo conectar con el servidor');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#05070d] px-4">
      <form
        onSubmit={handleSubmit}
        className="glass-panel w-full max-w-sm rounded-2xl border border-white/10 p-8"
      >
        <h1 className="mb-1 text-xl font-semibold text-cyan-300">Leo OS</h1>
        <p className="mb-6 text-sm text-slate-400">Ingresá la contraseña para acceder.</p>

        <input
          type="password"
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña"
          className="w-full rounded-lg border border-white/10 bg-black/30 px-4 py-2.5 text-slate-100 outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/30"
        />

        {error && <p className="mt-3 text-sm text-rose-400">{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting || !password}
          className="mt-5 w-full rounded-lg bg-cyan-500/90 px-4 py-2.5 font-medium text-black transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? 'Verificando…' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
