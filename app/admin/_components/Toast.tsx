'use client';

import { useEffect, useState } from 'react';

// ---------------------------------------------------------------------------
// H5 Ayak C Gün 2 — Minimal toast sistemi.
//
// Context/zustand yok — custom event pattern (bundle-safe, kolay reset).
// Trigger: window.dispatchEvent(new CustomEvent('studio:toast', { detail }))
// Helper: showToast({ variant, message, durationMs? })
// ---------------------------------------------------------------------------

export type ToastVariant = 'success' | 'error' | 'info';

export interface ToastPayload {
  variant: ToastVariant;
  message: string;
  durationMs?: number;
}

const EVENT_NAME = 'studio:toast';

export function showToast(payload: ToastPayload) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent<ToastPayload>(EVENT_NAME, { detail: payload }));
}

interface ActiveToast extends ToastPayload {
  id: number;
  durationMs: number;
}

const VARIANT_CLASS: Record<ToastVariant, string> = {
  success: 'border-emerald-500 bg-emerald-50 text-emerald-900',
  error: 'border-rose-500 bg-rose-50 text-rose-900',
  info: 'border-slate-400 bg-white text-slate-900',
};

const VARIANT_DOT: Record<ToastVariant, string> = {
  success: 'bg-emerald-500',
  error: 'bg-rose-500',
  info: 'bg-slate-400',
};

export function ToastHost() {
  const [toasts, setToasts] = useState<ActiveToast[]>([]);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<ToastPayload>).detail;
      const t: ActiveToast = {
        id: Date.now() + Math.random(),
        variant: detail.variant,
        message: detail.message,
        durationMs: detail.durationMs ?? 5000,
      };
      setToasts((prev) => [...prev, t]);
      window.setTimeout(
        () => setToasts((prev) => prev.filter((x) => x.id !== t.id)),
        t.durationMs
      );
    };
    window.addEventListener(EVENT_NAME, handler);
    return () => window.removeEventListener(EVENT_NAME, handler);
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex w-[360px] max-w-[calc(100vw-2rem)] flex-col gap-2">
      {toasts.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}
          className={`pointer-events-auto flex items-start gap-3 rounded border px-4 py-3 text-left text-sm shadow-lg transition ${VARIANT_CLASS[t.variant]}`}
        >
          <span
            className={`mt-1.5 inline-block h-2 w-2 shrink-0 rounded-full ${VARIANT_DOT[t.variant]}`}
            aria-hidden="true"
          />
          <span className="flex-1 leading-relaxed">{t.message}</span>
          <span className="text-slate-400 hover:text-slate-600" aria-hidden="true">
            ×
          </span>
        </button>
      ))}
    </div>
  );
}
