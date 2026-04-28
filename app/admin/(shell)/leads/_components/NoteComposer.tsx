'use client';

import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';

export function NoteComposer({
  parentType,
  parentId,
}: {
  parentType: 'lead' | 'appointment';
  parentId: string;
}) {
  const router = useRouter();
  const [body, setBody] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = body.trim();
    if (!trimmed || saving) return;

    setSaving(true);
    setError(null);
    try {
      const endpoint =
        parentType === 'lead'
          ? `/api/admin/leads/${parentId}/notes`
          : `/api/admin/appointments/${parentId}/notes`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ body: trimmed }),
      });
      if (!response.ok) {
        const err = (await response.json().catch(() => ({}))) as { error?: string };
        throw new Error(err.error ?? 'Not eklenemedi.');
      }
      setBody('');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Hata');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Not ekle… (aynı ekip üyelerinin göreceği)"
        rows={3}
        disabled={saving}
        className="w-full resize-none rounded border border-slate-300 bg-white p-3 text-sm outline-none focus:border-blue-500 disabled:opacity-60"
      />
      <div className="flex items-center justify-between">
        {error ? (
          <span className="text-xs text-red-600">{error}</span>
        ) : (
          <span className="text-xs text-slate-400">
            Markdown yok; düz metin. Ctrl/Cmd+Enter göndermez — Ekle butonuna bas.
          </span>
        )}
        <button
          type="submit"
          disabled={saving || body.trim().length === 0}
          className="rounded bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {saving ? 'Ekleniyor…' : 'Ekle'}
        </button>
      </div>
    </form>
  );
}
