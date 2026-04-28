'use client';

import { useMemo, useState } from 'react';
import { showToast } from '../../../_components/Toast';

// ---------------------------------------------------------------------------
// H5 Ayak C Gün 3 — Destek istemci komponenti.
// Üstte yeni ticket formu, altta filtreli liste + statü toggle.
// ---------------------------------------------------------------------------

export interface Ticket {
  id: string;
  subject: string;
  body: string;
  status: 'open' | 'resolved';
  created_at: string;
  resolved_at: string | null;
}

type Filter = 'all' | 'open' | 'resolved';

function formatRelative(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return iso;
  const diffSec = Math.floor((Date.now() - then) / 1000);
  if (diffSec < 60) return 'az önce';
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)} dakika önce`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)} saat önce`;
  if (diffSec < 604800) return `${Math.floor(diffSec / 86400)} gün önce`;
  return new Date(iso).toLocaleDateString('tr-TR');
}

export function SupportClient({
  initialTickets,
}: {
  initialTickets: Ticket[];
}) {
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
  const [filter, setFilter] = useState<Filter>('all');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(
    () => (filter === 'all' ? tickets : tickets.filter((t) => t.status === filter)),
    [tickets, filter]
  );

  const counts = useMemo(
    () => ({
      all: tickets.length,
      open: tickets.filter((t) => t.status === 'open').length,
      resolved: tickets.filter((t) => t.status === 'resolved').length,
    }),
    [tickets]
  );

  const subjectValid = subject.trim().length >= 3 && subject.trim().length <= 200;
  const bodyValid = body.trim().length >= 10 && body.trim().length <= 2000;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!subjectValid || !bodyValid || submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/support-tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject: subject.trim(), body: body.trim() }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        ticket?: Ticket;
        emailSent?: boolean;
        emailError?: string | null;
        error?: string;
      };
      if (res.status === 201 && data.ok && data.ticket) {
        setTickets((prev) => [data.ticket!, ...prev]);
        setSubject('');
        setBody('');
        if (data.emailSent) {
          showToast({
            variant: 'success',
            message: 'Talep gönderildi. Studio sahibine email iletildi.',
          });
        } else {
          showToast({
            variant: 'info',
            message: `Talep kaydedildi ama email gönderilemedi: ${data.emailError ?? 'bilinmiyor'}. Studio sahibi listeden görecek.`,
            durationMs: 7000,
          });
        }
      } else {
        showToast({
          variant: 'error',
          message: data.error ?? `Gönderilemedi (HTTP ${res.status}).`,
        });
      }
    } catch (err) {
      showToast({
        variant: 'error',
        message: err instanceof Error ? err.message : 'Ağ hatası',
      });
    } finally {
      setSubmitting(false);
    }
  }

  async function toggleStatus(ticket: Ticket) {
    const newStatus = ticket.status === 'open' ? 'resolved' : 'open';
    try {
      const res = await fetch(`/api/admin/support-tickets/${ticket.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        ticket?: Ticket;
        error?: string;
      };
      if (res.status === 200 && data.ok && data.ticket) {
        setTickets((prev) =>
          prev.map((t) => (t.id === data.ticket!.id ? data.ticket! : t))
        );
        showToast({
          variant: 'success',
          message:
            newStatus === 'resolved'
              ? 'Talep çözüldü olarak işaretlendi.'
              : 'Talep yeniden açıldı.',
        });
      } else {
        showToast({
          variant: 'error',
          message: data.error ?? `Güncellenemedi (HTTP ${res.status}).`,
        });
      }
    } catch (err) {
      showToast({
        variant: 'error',
        message: err instanceof Error ? err.message : 'Ağ hatası',
      });
    }
  }

  return (
    <div className="space-y-8">
      {/* Yeni talep formu */}
      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <header className="mb-4">
          <h2 className="text-base font-semibold text-slate-900">Yeni Talep</h2>
          <p className="text-xs text-slate-500">
            Tema veya içerik editörünün kapsamı dışındaki istekler için kullanın.
            Gönderdiğinizde Studio sahibine email gider.
          </p>
        </header>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-slate-700">Konu</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              maxLength={200}
              placeholder="Örn: Logo değişikliği"
              className="mt-1 w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              required
            />
            <div className="mt-1 text-[11px] text-slate-400">
              {subject.trim().length}/200 — en az 3 karakter
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700">Detay</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              maxLength={2000}
              rows={5}
              placeholder="İstediğiniz değişikliği mümkün olduğunca somut anlatın. Hangi sayfa, hangi bölüm, nasıl görünsün?"
              className="mt-1 w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              required
            />
            <div className="mt-1 text-[11px] text-slate-400">
              {body.trim().length}/2000 — en az 10 karakter
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!subjectValid || !bodyValid || submitting}
              className="inline-flex items-center rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
            >
              {submitting ? 'Gönderiliyor…' : 'Talep Gönder'}
            </button>
          </div>
        </form>
      </section>

      {/* Liste */}
      <section>
        <div className="mb-3 flex items-center gap-2">
          {(['all', 'open', 'resolved'] as Filter[]).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={[
                'rounded-full border px-3 py-1 text-xs font-medium transition',
                filter === f
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50',
              ].join(' ')}
            >
              {f === 'all' ? 'Hepsi' : f === 'open' ? 'Açık' : 'Çözüldü'} ({counts[f]})
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white px-6 py-12 text-center text-sm text-slate-500">
            {tickets.length === 0 ? 'Henüz talep yok.' : `Bu filtre altında talep yok.`}
          </div>
        ) : (
          <ul className="space-y-3">
            {filtered.map((t) => {
              const expanded = expandedId === t.id;
              return (
                <li
                  key={t.id}
                  className="rounded-lg border border-slate-200 bg-white p-4 transition hover:border-slate-300"
                >
                  <div className="flex items-start justify-between gap-4">
                    <button
                      type="button"
                      onClick={() => setExpandedId(expanded ? null : t.id)}
                      className="flex-1 text-left"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={[
                            'inline-block rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide',
                            t.status === 'open'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800',
                          ].join(' ')}
                        >
                          {t.status === 'open' ? 'Açık' : 'Çözüldü'}
                        </span>
                        <h3 className="text-sm font-semibold text-slate-900">
                          {t.subject}
                        </h3>
                      </div>
                      <div className="mt-1 text-xs text-slate-500">
                        {formatRelative(t.created_at)}
                        {t.status === 'resolved' && t.resolved_at
                          ? ` · çözüldü: ${formatRelative(t.resolved_at)}`
                          : ''}
                      </div>
                      {!expanded ? (
                        <p className="mt-2 line-clamp-2 text-sm text-slate-600">
                          {t.body}
                        </p>
                      ) : null}
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleStatus(t)}
                      className={[
                        'shrink-0 rounded border px-3 py-1.5 text-xs font-medium transition',
                        t.status === 'open'
                          ? 'border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          : 'border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100',
                      ].join(' ')}
                    >
                      {t.status === 'open' ? 'Çöz' : 'Yeniden Aç'}
                    </button>
                  </div>
                  {expanded ? (
                    <div className="mt-3 whitespace-pre-wrap rounded bg-slate-50 p-3 text-sm text-slate-700">
                      {t.body}
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
