'use client';

import { useState } from 'react';
import { AnimationProvider, FadeIn, Stagger, StaggerItem } from '@/lib/motion';
import type { AnimationPreset } from '@/lib/preset-loader';

// H6 Sprint 14 — Animation preset editor.
// 4 radyo + canlı demo preview + Kaydet butonu.

interface Props {
  initialPreset: AnimationPreset;
}

const OPTIONS: Array<{
  value: AnimationPreset;
  label: string;
  description: string;
}> = [
  { value: 'none', label: 'Yok', description: 'Statik — hareket yok' },
  { value: 'subtle', label: 'Hafif', description: 'Minimal fade-in' },
  {
    value: 'normal',
    label: 'Normal',
    description: 'Scroll fade + slide (default)',
  },
  {
    value: 'energetic',
    label: 'Canlı',
    description: 'Scale + stagger + spring ease',
  },
];

export function AnimationEditor({ initialPreset }: Props) {
  const [preset, setPreset] = useState<AnimationPreset>(initialPreset);
  const [pending, setPending] = useState<AnimationPreset>(initialPreset);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [previewKey, setPreviewKey] = useState(0);

  const dirty = pending !== preset;

  const save = async () => {
    setSaving(true);
    setStatus(null);
    try {
      const res = await fetch('/api/admin/theme/animation', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ preset: pending }),
        credentials: 'same-origin',
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus(`Hata: ${data.error ?? res.status}`);
      } else {
        setPreset(pending);
        setStatus(
          data.redeployTriggered
            ? 'Kaydedildi — canlı site redeploy tetiklendi.'
            : 'Kaydedildi (redeploy: ' + (data.redeployError ?? 'hook yok') + ').'
        );
      }
    } catch (err) {
      setStatus(`Hata: ${err instanceof Error ? err.message : 'bilinmiyor'}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="space-y-6 rounded border border-slate-200 bg-white p-6">
      <div>
        <h2 className="text-lg font-semibold">Animasyon</h2>
        <p className="mt-1 text-sm text-slate-500">
          Scroll-triggered ve fade-in davranışını kontrol eder.{' '}
          <code className="rounded bg-slate-100 px-1 text-xs">prefers-reduced-motion</code>{' '}
          ayarı aktif olan kullanıcılarda her durumda statik render edilir.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
        {OPTIONS.map((opt) => (
          <label
            key={opt.value}
            className={`cursor-pointer rounded border p-3 text-sm transition ${
              pending === opt.value
                ? 'border-blue-500 bg-blue-50 text-blue-900'
                : 'border-slate-200 hover:border-slate-400'
            }`}
          >
            <input
              type="radio"
              name="animation-preset"
              value={opt.value}
              checked={pending === opt.value}
              onChange={() => {
                setPending(opt.value);
                setPreviewKey((k) => k + 1); // demo yeniden tetikle
              }}
              className="sr-only"
            />
            <div className="font-medium">{opt.label}</div>
            <div className="mt-1 text-xs text-slate-500">{opt.description}</div>
          </label>
        ))}
      </div>

      {/* Canlı demo */}
      <div className="rounded border border-dashed border-slate-300 bg-slate-50 p-6">
        <div className="mb-3 text-xs font-medium uppercase tracking-wider text-slate-500">
          Önizleme
        </div>
        <AnimationProvider key={previewKey} preset={pending}>
          <FadeIn>
            <h3 className="text-xl font-semibold text-slate-900">Başlık</h3>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="mt-2 text-sm text-slate-600">
              Bu bir demo paragrafıdır. Preset seçimi değiştikçe animasyon
              yeniden tetiklenir.
            </p>
          </FadeIn>
          <Stagger as="ul" className="mt-4 space-y-2 text-sm">
            {['İlk öğe', 'İkinci öğe', 'Üçüncü öğe'].map((item) => (
              <StaggerItem key={item}>
                <li
                  className="rounded border border-slate-200 bg-white px-3 py-2"
                >
                  {item}
                </li>
              </StaggerItem>
            ))}
          </Stagger>
        </AnimationProvider>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={save}
          disabled={!dirty || saving}
          className="rounded bg-blue-600 px-4 py-2 text-sm text-white disabled:opacity-50"
        >
          {saving ? 'Kaydediliyor...' : 'Kaydet'}
        </button>
        {dirty ? (
          <button
            type="button"
            onClick={() => setPending(preset)}
            disabled={saving}
            className="text-sm text-slate-600 hover:underline disabled:opacity-50"
          >
            İptal
          </button>
        ) : null}
        {status ? <span className="text-sm text-slate-600">{status}</span> : null}
      </div>
    </section>
  );
}
