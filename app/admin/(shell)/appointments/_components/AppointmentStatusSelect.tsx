'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

const STATUSES = [
  'requested',
  'confirmed',
  'completed',
  'cancelled',
  'no-show',
] as const;
type Status = (typeof STATUSES)[number];

const LABELS: Record<Status, string> = {
  requested: 'Beklemede',
  confirmed: 'Onaylı',
  completed: 'Tamamlandı',
  cancelled: 'İptal',
  'no-show': 'Gelmedi',
};

export function AppointmentStatusSelect({
  appointmentId,
  initialStatus,
  compact,
}: {
  appointmentId: string;
  initialStatus: string;
  compact?: boolean;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<Status>(
    (STATUSES as readonly string[]).includes(initialStatus)
      ? (initialStatus as Status)
      : 'requested'
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  async function handleChange(next: Status) {
    const prev = status;
    setStatus(next);
    setSaving(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/appointments/${appointmentId}`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ status: next }),
      });
      if (!response.ok) {
        const body = (await response.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error ?? 'Güncellenemedi.');
      }
      startTransition(() => {
        router.refresh();
      });
    } catch (err) {
      setStatus(prev);
      setError(err instanceof Error ? err.message : 'Hata');
    } finally {
      setSaving(false);
    }
  }

  const size = compact ? 'text-xs py-1 px-2' : 'text-sm py-1.5 px-3';

  return (
    <div className="inline-flex flex-col items-start gap-1">
      <select
        value={status}
        onChange={(e) => handleChange(e.target.value as Status)}
        disabled={saving}
        className={`rounded border border-slate-300 bg-white ${size} text-slate-900 outline-none focus:border-blue-500 disabled:opacity-60`}
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {LABELS[s]}
          </option>
        ))}
      </select>
      {error ? <span className="text-xs text-red-600">{error}</span> : null}
    </div>
  );
}
