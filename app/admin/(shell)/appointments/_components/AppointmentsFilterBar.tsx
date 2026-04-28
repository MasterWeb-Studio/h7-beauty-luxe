'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useTransition } from 'react';

const STATUS_OPTIONS = [
  { value: 'all', label: 'Tümü' },
  { value: 'requested', label: 'Beklemede' },
  { value: 'confirmed', label: 'Onaylı' },
  { value: 'completed', label: 'Tamamlandı' },
  { value: 'cancelled', label: 'İptal' },
  { value: 'no-show', label: 'Gelmedi' },
] as const;

const RANGE_OPTIONS = [
  { value: 'all', label: 'Tümü' },
  { value: 'today', label: 'Bugün' },
  { value: 'week', label: 'Bu hafta' },
  { value: 'month', label: 'Bu ay' },
] as const;

export function AppointmentsFilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentStatus = searchParams.get('status') ?? 'all';
  const currentRange = searchParams.get('range') ?? 'all';

  function applyParams(updates: Record<string, string | null>) {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    for (const [k, v] of Object.entries(updates)) {
      if (v === null || v === '') params.delete(k);
      else params.set(k, v);
    }
    params.delete('page');
    const qs = params.toString();
    startTransition(() => {
      router.replace(qs ? `${pathname}?${qs}` : pathname);
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-4 rounded-lg border border-slate-200 bg-white p-3">
      <div className="flex flex-col gap-1">
        <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
          Statü
        </span>
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
                className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
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
      </div>

      <div className="flex flex-col gap-1 ml-auto">
        <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
          Tarih aralığı
        </span>
        <div className="flex flex-wrap gap-1">
          {RANGE_OPTIONS.map((opt) => {
            const active = currentRange === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() =>
                  applyParams({ range: opt.value === 'all' ? null : opt.value })
                }
                disabled={isPending}
                className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
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
      </div>
    </div>
  );
}
