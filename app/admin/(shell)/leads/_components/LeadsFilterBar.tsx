'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useState, useTransition, type FormEvent } from 'react';

const STATUS_OPTIONS = [
  { value: 'all', label: 'Tümü' },
  { value: 'new', label: 'Yeni' },
  { value: 'contacted', label: 'İletişim' },
  { value: 'qualified', label: 'Nitelikli' },
  { value: 'closed', label: 'Kapandı' },
] as const;

export function LeadsFilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentStatus = searchParams.get('status') ?? 'all';
  const [q, setQ] = useState(searchParams.get('q') ?? '');

  function applyParams(updates: Record<string, string | null>) {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    for (const [k, v] of Object.entries(updates)) {
      if (v === null || v === '') params.delete(k);
      else params.set(k, v);
    }
    params.delete('page'); // filter değişiminde başa dön
    const qs = params.toString();
    startTransition(() => {
      router.replace(qs ? `${pathname}?${qs}` : pathname);
    });
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    applyParams({ q: q.trim() || null });
  }

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-lg border border-slate-200 bg-white p-3">
      <div className="flex flex-wrap gap-1">
        {STATUS_OPTIONS.map((opt) => {
          const active = currentStatus === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() =>
                applyParams({ status: opt.value === 'all' ? null : opt.value })
              }
              disabled={isPending}
              className={`rounded px-3 py-1.5 text-xs font-medium transition-colors ${
                active
                  ? 'bg-blue-600 text-white'
                  : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              } disabled:opacity-60`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSubmit} className="ml-auto flex items-center gap-2">
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="İsim veya e-posta ara…"
          className="w-64 rounded border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-blue-500"
        />
        <button
          type="submit"
          disabled={isPending}
          className="rounded bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800 disabled:opacity-60"
        >
          Ara
        </button>
        {q ? (
          <button
            type="button"
            onClick={() => {
              setQ('');
              applyParams({ q: null });
            }}
            className="text-xs text-slate-500 hover:text-slate-900"
          >
            Temizle
          </button>
        ) : null}
      </form>
    </div>
  );
}
