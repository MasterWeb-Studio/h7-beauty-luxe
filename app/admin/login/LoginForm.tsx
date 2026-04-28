'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, type FormEvent } from 'react';

type Status = 'idle' | 'submitting';

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get('from') ?? '/admin';

  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === 'submitting') return;

    setError(null);
    const form = event.currentTarget;
    const password = (new FormData(form).get('password') ?? '').toString();
    if (!password) return;

    setStatus('submitting');
    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error ?? 'Giriş başarısız.');
      }

      // Cookie set edildi — middleware artık geçirecek. from'a yönlendir.
      const target = from.startsWith('/admin') ? from : '/admin';
      router.push(target);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bilinmeyen hata.');
      setStatus('idle');
    }
  }

  const submitting = status === 'submitting';

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-sm rounded border border-slate-200 bg-white p-8 shadow-sm"
      noValidate
    >
      <h1 className="text-lg font-semibold text-slate-900">Admin Girişi</h1>
      <p className="mt-1 text-sm text-slate-500">
        Bu proje için üretilen şifreyle giriş yapın.
      </p>

      {error ? (
        <div
          role="alert"
          className="mt-5 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          {error}
        </div>
      ) : null}

      <div className="mt-5">
        <label htmlFor="admin-password" className="mb-2 block text-sm font-medium text-slate-700">
          Şifre
        </label>
        <input
          id="admin-password"
          name="password"
          type="password"
          required
          autoFocus
          autoComplete="current-password"
          disabled={submitting}
          className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-60"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="mt-6 w-full rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-opacity hover:bg-blue-700 disabled:opacity-60"
      >
        {submitting ? 'Giriliyor…' : 'Giriş Yap'}
      </button>

      <p className="mt-6 text-xs text-slate-400">
        Şifreyi bilmiyor musunuz? <code className="rounded bg-slate-100 px-1.5 py-0.5">.env.local</code>
        &apos;de <code className="rounded bg-slate-100 px-1.5 py-0.5">ADMIN_PASSWORD</code>.
      </p>
    </form>
  );
}
