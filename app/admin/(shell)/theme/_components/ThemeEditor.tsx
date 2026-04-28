'use client';

import { useEffect, useMemo, useState } from 'react';
import type { PresetSelection } from '../../../../../lib/preset-loader';
import {
  validatePresetSelection,
  type PresetViolation,
} from '../../../../../lib/preset-validation';
import {
  TYPOGRAPHY_OPTIONS,
  GRID_OPTIONS,
  SPACING_OPTIONS,
  RADIUS_OPTIONS,
  DENSITY_OPTIONS,
  PALETTE_OPTIONS,
  type CatalogOption,
} from '../../../../../lib/preset-catalog';
import { showToast } from '../../../_components/Toast';
import { ThemePreview } from './ThemePreview';

// ---------------------------------------------------------------------------
// H5 Ayak C Gün 2 — Tema editörü client component.
//
// State: local PresetSelection + saving + rate-limit cooldown + violations.
// Compat matrix client-side live — hover'lanan kart "bu seçim yapılırsa ne
// olur" simulate edilir, yasaklı ise disabled + tooltip.
// Save → PATCH /api/admin/theme; response'a göre toast.
// ---------------------------------------------------------------------------

const COOLDOWN_MS = 2 * 60 * 1000;

interface Props {
  initialPreset: PresetSelection;
}

type FieldKey = keyof PresetSelection;

function buildSimulated(
  current: PresetSelection,
  field: FieldKey,
  id: string
): PresetSelection {
  return { ...current, [field]: id };
}

function findViolationFor(
  violations: PresetViolation[],
  field: FieldKey,
  id: string
): PresetViolation | undefined {
  return violations.find(
    (v) => v.field === 'pair' && v.message.includes(id)
  ) ?? violations.find((v) => v.field === field);
}

export function ThemeEditor({ initialPreset }: Props) {
  const [preset, setPreset] = useState<PresetSelection>(initialPreset);
  const [baseline, setBaseline] = useState<PresetSelection>(initialPreset);
  const [saving, setSaving] = useState(false);
  const [cooldownUntil, setCooldownUntil] = useState<number | null>(null);
  const [serverViolations, setServerViolations] = useState<PresetViolation[]>([]);

  // Mevcut seçimin validation durumu (save butonu enable/disable için)
  const currentCheck = useMemo(() => validatePresetSelection(preset), [preset]);

  const isDirty = useMemo(
    () =>
      (Object.keys(preset) as FieldKey[]).some(
        (k) => preset[k] !== baseline[k]
      ),
    [preset, baseline]
  );

  const cooldownRemainingSec = useCooldownRemaining(cooldownUntil);

  const canSave =
    !saving &&
    isDirty &&
    currentCheck.valid &&
    (cooldownUntil === null || Date.now() >= cooldownUntil);

  function selectOption(field: FieldKey, id: string) {
    const simulated = buildSimulated(preset, field, id);
    const check = validatePresetSelection(simulated);
    if (!check.valid) {
      // Kullanıcı disabled'a tıkladıysa (normalde UI pointer-events-none ama
      // keyboard için defansif)
      const first = check.violations[0];
      showToast({
        variant: 'error',
        message: `Uyumsuz seçim: ${first?.message ?? 'compatibility matrix'}`,
      });
      return;
    }
    setPreset(simulated);
    setServerViolations([]);
  }

  async function handleSave() {
    if (!canSave) return;
    setSaving(true);
    setServerViolations([]);
    try {
      const res = await fetch('/api/admin/theme', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preset),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        violations?: PresetViolation[];
        redeployTriggered?: boolean;
        redeployError?: string | null;
        error?: string;
      };

      if (res.status === 200 && data.ok) {
        setBaseline(preset);
        setCooldownUntil(Date.now() + COOLDOWN_MS);
        if (data.redeployTriggered) {
          showToast({
            variant: 'success',
            message:
              'Tema kaydedildi. Yeni görünüm ~2 dakika içinde canlıda olacak.',
          });
        } else {
          showToast({
            variant: 'info',
            message:
              `Tema kaydedildi ama redeploy tetiklenemedi: ${data.redeployError ?? 'bilinmiyor'}. Vercel'den manuel deploy gerek.`,
            durationMs: 8000,
          });
        }
      } else if (res.status === 400 && data.violations) {
        setServerViolations(data.violations);
        showToast({
          variant: 'error',
          message: `Uyumsuz preset: ${data.violations[0]?.message ?? 'compat error'}`,
        });
      } else {
        showToast({
          variant: 'error',
          message: data.error ?? `Deploy tetiklenemedi (HTTP ${res.status}).`,
          durationMs: 8000,
        });
      }
    } catch (err) {
      showToast({
        variant: 'error',
        message: err instanceof Error ? err.message : 'Ağ hatası',
        durationMs: 8000,
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        {/* Info banner — font loading limitasyonu şeffaflığı */}
        <div className="rounded border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <strong>Önizleme</strong> mevcut yüklü fontlarla gösterilir. Yeni tema
          <strong> Kaydet ve Deploy</strong> sonrası tam görünümüyle canlı olur
          (~2 dk).
        </div>

        <CategoryCard label="Tipografi" description="Başlık + metin aile stili">
          <div className="grid grid-cols-2 gap-3">
            {TYPOGRAPHY_OPTIONS.map((opt) => {
              const status = statusOf(preset, 'typography', opt.id);
              return (
                <OptionCard
                  key={opt.id}
                  opt={opt}
                  selected={preset.typography === opt.id}
                  disabled={status.disabled}
                  reason={status.reason}
                  onSelect={() => selectOption('typography', opt.id)}
                >
                  <div
                    className="text-2xl leading-tight"
                    style={{ fontFamily: opt.cssFontVar }}
                  >
                    {opt.preview}
                  </div>
                </OptionCard>
              );
            })}
          </div>
        </CategoryCard>

        <CategoryCard label="Renk paleti" description="Sektörel 18 seçenek">
          <PaletteGrid
            selected={preset.palette}
            onSelect={(id) => selectOption('palette', id)}
          />
        </CategoryCard>

        <CategoryCard label="Grid" description="Sütun + gutter ritmi">
          <OptionRow>
            {GRID_OPTIONS.map((opt) => {
              const status = statusOf(preset, 'grid', opt.id);
              return (
                <OptionCard
                  key={opt.id}
                  opt={opt}
                  selected={preset.grid === opt.id}
                  disabled={status.disabled}
                  reason={status.reason}
                  onSelect={() => selectOption('grid', opt.id)}
                />
              );
            })}
          </OptionRow>
        </CategoryCard>

        <CategoryCard label="Boşluk" description="Section gap + padding">
          <OptionRow>
            {SPACING_OPTIONS.map((opt) => {
              const status = statusOf(preset, 'spacing', opt.id);
              return (
                <OptionCard
                  key={opt.id}
                  opt={opt}
                  selected={preset.spacing === opt.id}
                  disabled={status.disabled}
                  reason={status.reason}
                  onSelect={() => selectOption('spacing', opt.id)}
                />
              );
            })}
          </OptionRow>
        </CategoryCard>

        <CategoryCard label="Yuvarlama" description="Buton + kart köşesi">
          <OptionRow>
            {RADIUS_OPTIONS.map((opt) => {
              const status = statusOf(preset, 'radius', opt.id);
              return (
                <OptionCard
                  key={opt.id}
                  opt={opt}
                  selected={preset.radius === opt.id}
                  disabled={status.disabled}
                  reason={status.reason}
                  onSelect={() => selectOption('radius', opt.id)}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="inline-block h-8 w-8 border border-slate-400 bg-slate-100"
                      style={{ borderRadius: `${Math.min(opt.px, 16)}px` }}
                    />
                  </div>
                </OptionCard>
              );
            })}
          </OptionRow>
        </CategoryCard>

        <CategoryCard label="Yoğunluk" description="Section sayısı + kart miktarı">
          <OptionRow>
            {DENSITY_OPTIONS.map((opt) => {
              const status = statusOf(preset, 'density', opt.id);
              return (
                <OptionCard
                  key={opt.id}
                  opt={opt}
                  selected={preset.density === opt.id}
                  disabled={status.disabled}
                  reason={status.reason}
                  onSelect={() => selectOption('density', opt.id)}
                />
              );
            })}
          </OptionRow>
        </CategoryCard>

        {serverViolations.length > 0 ? (
          <div className="rounded border border-rose-300 bg-rose-50 p-4 text-sm text-rose-900">
            <div className="font-semibold">Sunucu reddetti:</div>
            <ul className="mt-1 list-disc pl-5">
              {serverViolations.map((v, i) => (
                <li key={i}>{v.message}</li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="sticky bottom-4 flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4 shadow-md">
          <div className="text-sm text-slate-600">
            {isDirty
              ? 'Kaydedilmemiş değişiklik var.'
              : 'Değişiklik yok.'}
            {cooldownRemainingSec !== null && cooldownRemainingSec > 0 ? (
              <span className="ml-2 text-amber-700">
                Tekrar kaydetmek için {formatMs(cooldownRemainingSec)} bekleyin.
              </span>
            ) : null}
          </div>
          <button
            type="button"
            onClick={handleSave}
            disabled={!canSave}
            className="inline-flex items-center gap-2 rounded bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
          >
            {saving ? 'Deploy tetikleniyor…' : 'Kaydet ve Deploy Et'}
          </button>
        </div>
      </div>

      <div className="lg:sticky lg:top-4 lg:self-start">
        <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-500">
          Canlı önizleme
        </div>
        <ThemePreview preset={preset} />
      </div>
    </div>
  );

  function statusOf(
    current: PresetSelection,
    field: FieldKey,
    id: string
  ): { disabled: boolean; reason: string | null } {
    if (current[field] === id) return { disabled: false, reason: null };
    const simulated = buildSimulated(current, field, id);
    const check = validatePresetSelection(simulated);
    if (check.valid) return { disabled: false, reason: null };
    const v = findViolationFor(check.violations, field, id);
    return { disabled: true, reason: v?.message ?? 'Uyumsuz' };
  }
}

// ---------------------------------------------------------------------------
// Katalog render helpers
// ---------------------------------------------------------------------------

function CategoryCard({
  label,
  description,
  children,
}: {
  label: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5">
      <header className="mb-4">
        <h2 className="text-base font-semibold text-slate-900">{label}</h2>
        <p className="text-xs text-slate-500">{description}</p>
      </header>
      {children}
    </section>
  );
}

function OptionRow({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-2 gap-3 md:grid-cols-4">{children}</div>;
}

function OptionCard({
  opt,
  selected,
  disabled,
  reason,
  onSelect,
  children,
}: {
  opt: CatalogOption;
  selected: boolean;
  disabled: boolean;
  reason: string | null;
  onSelect: () => void;
  children?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={disabled ? undefined : onSelect}
      disabled={disabled}
      title={disabled ? reason ?? 'Uyumsuz' : opt.description}
      className={[
        'group relative flex flex-col items-start gap-2 rounded-lg border p-3 text-left transition',
        selected
          ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-300'
          : disabled
          ? 'cursor-not-allowed border-slate-200 bg-slate-50 opacity-50'
          : 'border-slate-200 bg-white hover:border-slate-400 hover:bg-slate-50',
      ].join(' ')}
    >
      {children}
      <div className="w-full">
        <div className="text-sm font-medium text-slate-900">{opt.label}</div>
        <div className="text-xs leading-snug text-slate-500 line-clamp-2">
          {opt.description}
        </div>
      </div>
      {disabled ? (
        <span className="absolute right-2 top-2 rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-medium text-rose-700">
          Uyumsuz
        </span>
      ) : null}
    </button>
  );
}

function PaletteGrid({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (id: string) => void;
}) {
  // Group by .group alanı
  const groups = PALETTE_OPTIONS.reduce<Record<string, typeof PALETTE_OPTIONS>>(
    (acc, p) => {
      if (!acc[p.group]) acc[p.group] = [];
      acc[p.group]!.push(p);
      return acc;
    },
    {}
  );

  return (
    <div className="space-y-5">
      {Object.entries(groups).map(([group, palettes]) => (
        <div key={group}>
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            {group}
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {palettes.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => onSelect(p.id)}
                title={p.description}
                className={[
                  'flex flex-col items-start gap-2 rounded-lg border p-3 text-left transition',
                  selected === p.id
                    ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-300'
                    : 'border-slate-200 bg-white hover:border-slate-400',
                ].join(' ')}
              >
                <div className="flex gap-1">
                  <span
                    className="inline-block h-6 w-6 rounded border border-slate-200"
                    style={{ background: p.primary }}
                    aria-hidden="true"
                  />
                  <span
                    className="inline-block h-6 w-6 rounded border border-slate-200"
                    style={{ background: p.secondary }}
                    aria-hidden="true"
                  />
                  <span
                    className="inline-block h-6 w-6 rounded border border-slate-200"
                    style={{ background: p.accent }}
                    aria-hidden="true"
                  />
                  <span
                    className="inline-block h-6 w-6 rounded border border-slate-200"
                    style={{ background: p.bg }}
                    aria-hidden="true"
                  />
                </div>
                <div className="text-sm font-medium text-slate-900">{p.label}</div>
                <div className="text-xs leading-snug text-slate-500 line-clamp-2">
                  {p.description}
                </div>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Cooldown — re-render bağımlı timer
// ---------------------------------------------------------------------------

function useCooldownRemaining(until: number | null): number | null {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    if (!until) return;
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [until]);
  if (!until) return null;
  const remaining = until - now;
  return remaining > 0 ? remaining : null;
}

function formatMs(ms: number): string {
  const total = Math.ceil(ms / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}
