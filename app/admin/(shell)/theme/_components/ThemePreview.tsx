'use client';

import type { CSSProperties } from 'react';
import type { PresetSelection } from '../../../../../lib/preset-loader';
import {
  PALETTE_OPTIONS,
  TYPOGRAPHY_OPTIONS,
  RADIUS_OPTIONS,
} from '../../../../../lib/preset-catalog';

// ---------------------------------------------------------------------------
// Mock önizleme — admin "Tema" sekmesinde sağ kolonda.
// Wrapper div inline style ile seçili preset'in renk/font/radius değerlerini
// CSS var'a inject eder; iç komponent CSS var'ları okur. Global <html>
// data-* selector'leri etkilenmez (scope izole).
//
// Font NOT: Admin sayfası layout.tsx'in yüklediği 5 preset fontunu
// kullanır. Yeni typography seçilince o font zaten yüklü (swap).
// ---------------------------------------------------------------------------

interface Props {
  preset: PresetSelection;
}

export function ThemePreview({ preset }: Props) {
  const palette =
    PALETTE_OPTIONS.find((p) => p.id === preset.palette) ?? PALETTE_OPTIONS[0]!;
  const typography =
    TYPOGRAPHY_OPTIONS.find((t) => t.id === preset.typography) ??
    TYPOGRAPHY_OPTIONS[0]!;
  const radius =
    RADIUS_OPTIONS.find((r) => r.id === preset.radius) ?? RADIUS_OPTIONS[1]!;

  const wrapperStyle: CSSProperties = {
    // Palette
    ['--color-primary' as string]: palette.primary,
    ['--color-secondary' as string]: palette.secondary,
    ['--color-accent' as string]: palette.accent,
    ['--color-bg' as string]: palette.bg,
    ['--color-text' as string]: palette.text,
    ['--color-background' as string]: palette.bg,
    ['--color-foreground' as string]: palette.text,
    ['--color-text-muted' as string]: palette.text + 'aa',
    ['--color-border' as string]: palette.secondary,
    // Typography
    ['--font-display' as string]: typography.cssFontVar,
    ['--font-heading' as string]: typography.cssFontVar,
    // Radius
    ['--radius-button' as string]: `${radius.px}px`,
    ['--radius-card' as string]: `${radius.px}px`,
    ['--radius' as string]: `${radius.px}px`,
    background: palette.bg,
    color: palette.text,
  };

  return (
    <div
      className="overflow-hidden rounded-lg border border-slate-200 shadow-sm"
      style={wrapperStyle}
    >
      {/* Mini hero */}
      <div className="px-6 py-8" style={{ background: 'var(--color-bg)' }}>
        <div
          className="mb-2 text-[10px] font-semibold uppercase tracking-widest"
          style={{ color: 'var(--color-accent)' }}
        >
          Önizleme
        </div>
        <h3
          className="text-2xl leading-tight tracking-tight"
          style={{
            fontFamily: 'var(--font-display)',
            color: 'var(--color-text)',
          }}
        >
          Örnek Başlık
        </h3>
        <p
          className="mt-3 text-sm leading-relaxed"
          style={{ color: 'var(--color-text-muted)' }}
        >
          Bu, seçili preset ile üretilmiş örnek bir hero metnidir.
        </p>
        <div className="mt-5 flex gap-2">
          <span
            className="inline-flex items-center justify-center px-4 py-2 text-xs font-medium"
            style={{
              background: 'var(--color-primary)',
              color: 'var(--color-bg)',
              borderRadius: 'var(--radius-button)',
            }}
          >
            Birincil eylem
          </span>
          <span
            className="inline-flex items-center justify-center border px-4 py-2 text-xs font-medium"
            style={{
              borderColor: 'var(--color-border)',
              color: 'var(--color-text)',
              borderRadius: 'var(--radius-button)',
            }}
          >
            İkincil
          </span>
        </div>
      </div>

      {/* Feature card */}
      <div
        className="border-t px-6 py-6"
        style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg)' }}
      >
        <div
          className="inline-flex h-9 w-9 items-center justify-center text-xs"
          style={{
            background: 'var(--color-secondary)',
            color: 'var(--color-primary)',
            borderRadius: 'var(--radius-card)',
          }}
          aria-hidden="true"
        >
          ✦
        </div>
        <div
          className="mt-3 text-sm font-semibold"
          style={{ color: 'var(--color-text)' }}
        >
          Özellik kartı
        </div>
        <div className="mt-1 text-xs" style={{ color: 'var(--color-text-muted)' }}>
          Hizmet veya değer açıklaması burada.
        </div>
      </div>

      {/* Mini CTA */}
      <div
        className="px-6 py-6"
        style={{ background: 'var(--color-text)', color: 'var(--color-bg)' }}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="text-sm font-medium" style={{ fontFamily: 'var(--font-display)' }}>
            Hemen başlayalım
          </div>
          <span
            className="inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium"
            style={{
              background: 'var(--color-bg)',
              color: 'var(--color-text)',
              borderRadius: 'var(--radius-button)',
            }}
          >
            İletişim
          </span>
        </div>
      </div>
    </div>
  );
}
