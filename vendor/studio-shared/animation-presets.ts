// ---------------------------------------------------------------------------
// H6 Sprint 14 — Animation preset
//
// Kullanıcı admin/theme'den 4 seçenekten birini seçer:
//   - 'none': statik site (erişilebilirlik + performans maksimum)
//   - 'subtle': minimal fade
//   - 'normal': standart scroll-triggered (default)
//   - 'energetic': zengin scale + translate + stagger
//
// prefers-reduced-motion OS/browser ayarı aktifse hangi preset seçilmiş
// olursa olsun motion primitive'ları statik render eder (override).
// ---------------------------------------------------------------------------

import { z } from 'zod';

export type AnimationPreset = 'none' | 'subtle' | 'normal' | 'energetic';

export interface AnimationTokens {
  /** Duration in seconds (framer-motion format). */
  duration: { fast: number; base: number; slow: number };
  /** Stagger delay (children arası) — saniye. */
  stagger: number;
  /** Framer-motion ease — string ya da cubic-bezier array. */
  ease: string | [number, number, number, number];
  /** useInView eşiği (0-1) — viewport yüzdesi. */
  scrollOffset: number;
  /** Hangi transform özellikleri aktif. */
  scale: boolean;
  opacity: boolean;
  translate: boolean;
}

export const ANIMATION_PRESETS: Record<AnimationPreset, AnimationTokens> = {
  none: {
    duration: { fast: 0, base: 0, slow: 0 },
    stagger: 0,
    ease: 'linear',
    scrollOffset: 0,
    scale: false,
    opacity: false,
    translate: false,
  },
  subtle: {
    duration: { fast: 0.2, base: 0.3, slow: 0.5 },
    stagger: 0.05,
    ease: 'easeOut',
    scrollOffset: 0.1,
    scale: false,
    opacity: true,
    translate: false,
  },
  normal: {
    duration: { fast: 0.3, base: 0.5, slow: 0.8 },
    stagger: 0.1,
    ease: 'easeOut',
    scrollOffset: 0.15,
    scale: true,
    opacity: true,
    translate: true,
  },
  energetic: {
    duration: { fast: 0.4, base: 0.7, slow: 1.2 },
    stagger: 0.15,
    ease: [0.16, 1, 0.3, 1],
    scrollOffset: 0.2,
    scale: true,
    opacity: true,
    translate: true,
  },
};

export const DEFAULT_ANIMATION: AnimationPreset = 'normal';

export const AnimationPresetSchema = z.enum(['none', 'subtle', 'normal', 'energetic']);

/** Preset sağlam mı — değilse default döner. */
export function resolveAnimation(preset: unknown): AnimationPreset {
  const parsed = AnimationPresetSchema.safeParse(preset);
  return parsed.success ? parsed.data : DEFAULT_ANIMATION;
}

export function getAnimationTokens(preset: AnimationPreset): AnimationTokens {
  return ANIMATION_PRESETS[preset];
}

/** Display metadata — admin UI'da label. */
export const ANIMATION_LABELS: Record<
  AnimationPreset,
  { tr: string; en: string; description: { tr: string; en: string } }
> = {
  none: {
    tr: 'Yok',
    en: 'None',
    description: {
      tr: 'Statik — hareket yok. Performans ve erişilebilirlik maksimum.',
      en: 'Static — no motion. Max performance + accessibility.',
    },
  },
  subtle: {
    tr: 'Hafif',
    en: 'Subtle',
    description: {
      tr: 'Çok hafif fade-in — minimal dikkat çekici.',
      en: 'Minimal fade-in — non-intrusive.',
    },
  },
  normal: {
    tr: 'Normal',
    en: 'Normal',
    description: {
      tr: 'Scroll-triggered fade + slide. Kurumsal standart.',
      en: 'Scroll-triggered fade + slide. Corporate standard.',
    },
  },
  energetic: {
    tr: 'Canlı',
    en: 'Energetic',
    description: {
      tr: 'Scale + stagger + spring ease. Ajans / kreatif projeler.',
      en: 'Scale + stagger + spring ease. Creative agency style.',
    },
  },
};
