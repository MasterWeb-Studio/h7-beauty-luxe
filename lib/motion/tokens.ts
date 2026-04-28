// ---------------------------------------------------------------------------
// H6 Sprint 14 — Animation token context
//
// Server component'ta `getAnimationPreset()` Supabase'den preset çeker,
// kök `<html data-animation="<preset>">` attribute'u set eder. Client
// motion primitive'leri bu attribute'tan preset'i okur (AnimationProvider).
//
// Fallback: Supabase yoksa veya preset invalid ise 'normal'.
// ---------------------------------------------------------------------------

import {
  DEFAULT_ANIMATION,
  type AnimationPreset,
  type AnimationTokens,
  ANIMATION_PRESETS,
  resolveAnimation,
} from '@studio/shared/animation';

export { ANIMATION_PRESETS, DEFAULT_ANIMATION };
export type { AnimationPreset, AnimationTokens };

export function getTokens(preset: AnimationPreset): AnimationTokens {
  return ANIMATION_PRESETS[preset];
}

export { resolveAnimation };
