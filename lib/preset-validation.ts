import type { PresetSelection } from './preset-loader';

// ---------------------------------------------------------------------------
// H5 Ayak C Gün 1 — Template-side preset validation.
// Shared paketten duplicate (standalone deploy, template @studio/shared'a
// bağlı değil). Scaffolder preset'leri bu listeden üretiyor; müşteri admin
// panelinden yeni preset seçerse aynı kurallara tabi.
// ---------------------------------------------------------------------------

export const TYPOGRAPHY_IDS = [
  'type-classic',
  'type-modern',
  'type-editorial',
  'type-tech',
] as const;

export const GRID_IDS = ['grid-tight', 'grid-balanced', 'grid-airy'] as const;

export const SPACING_IDS = ['space-compact', 'space-default', 'space-generous'] as const;

export const RADIUS_IDS = [
  'radius-sharp',
  'radius-soft',
  'radius-rounded',
  'radius-pill',
] as const;

export const DENSITY_IDS = [
  'density-minimal',
  'density-moderate',
  'density-rich',
] as const;

// Palette'ler sabit bir union olarak tutulmadı; string kabul edilir
// (scaffolder'da 18 palette var, kullanıcıya gelecek UI'da seçim kısıtlanır).

const INCOMPATIBLE_PAIRS: Array<{ a: string; b: string; reason: string }> = [
  { a: 'type-tech', b: 'radius-pill', reason: 'Monospace tech + pill aşırı' },
  { a: 'type-editorial', b: 'radius-sharp', reason: 'Editorial yumuşak ister' },
  { a: 'type-editorial', b: 'radius-pill', reason: 'Editorial + pill stilize' },
  { a: 'grid-tight', b: 'space-generous', reason: 'Sıkışık grid + geniş çelişki' },
  { a: 'grid-airy', b: 'space-compact', reason: 'Havadar + sıkışık çelişki' },
  { a: 'density-rich', b: 'space-generous', reason: 'Yoğun + geniş = scroll yorgunluğu' },
  { a: 'density-minimal', b: 'space-compact', reason: 'Az içerik + sıkışık' },
];

export interface PresetViolation {
  field: keyof PresetSelection | 'pair';
  message: string;
}

/** Alan tiplerini + kombinasyon uyumluluğunu doğrular. */
export function validatePresetSelection(
  selection: unknown
): { valid: true; data: PresetSelection } | { valid: false; violations: PresetViolation[] } {
  const violations: PresetViolation[] = [];

  if (!selection || typeof selection !== 'object') {
    return {
      valid: false,
      violations: [{ field: 'pair', message: 'presetSelection objesi gerekli.' }],
    };
  }
  const s = selection as Record<string, unknown>;

  const check = (
    field: keyof PresetSelection,
    allowed: readonly string[] | null
  ): string | undefined => {
    const v = s[field];
    if (typeof v !== 'string' || !v) {
      violations.push({ field, message: `${field} string olmalı` });
      return undefined;
    }
    if (allowed && !allowed.includes(v)) {
      violations.push({
        field,
        message: `${field}="${v}" geçersiz. İzinli: ${allowed.join(' | ')}`,
      });
      return undefined;
    }
    return v;
  };

  const typography = check('typography', TYPOGRAPHY_IDS);
  const grid = check('grid', GRID_IDS);
  const spacing = check('spacing', SPACING_IDS);
  const radius = check('radius', RADIUS_IDS);
  const density = check('density', DENSITY_IDS);
  const palette = check('palette', null); // 18 palette — pattern kontrolü yerine varlık yeterli

  if (violations.length > 0) {
    return { valid: false, violations };
  }

  // Compatibility matrix
  const set = new Set([typography, grid, spacing, radius, density].filter(Boolean) as string[]);
  for (const pair of INCOMPATIBLE_PAIRS) {
    if (set.has(pair.a) && set.has(pair.b)) {
      violations.push({
        field: 'pair',
        message: `Yasaklı kombinasyon: ${pair.a} × ${pair.b} (${pair.reason})`,
      });
    }
  }

  if (violations.length > 0) {
    return { valid: false, violations };
  }

  return {
    valid: true,
    data: {
      typography: typography!,
      grid: grid!,
      spacing: spacing!,
      radius: radius!,
      density: density!,
      palette: palette!,
    },
  };
}
