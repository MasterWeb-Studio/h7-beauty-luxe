import { cache } from 'react';
import { unstable_cache } from 'next/cache';
import { getAdminSupabase, getProjectId, getTenantId } from './supabase-admin';

// ---------------------------------------------------------------------------
// H5 Ayak C Gün 1 — Preset runtime loader.
//
// layout.tsx <html data-*> attribute'larını çözmek için preset'i Supabase'den
// okur. Admin "Tema" sekmesi DB'yi günceller → Vercel Deploy Hook redeploy
// tetikler → bu dosya yeni build'de taze preset çeker.
//
// Cache stratejisi content-loader ile aynı:
//   - unstable_cache: 5 dk revalidate + tag-based
//   - React.cache: per-request dedup
//
// DB'den null / hata → DEFAULT_PRESET. Template bağımsız deploy için shared
// tiplerini duplicate ediyoruz (standalone bağımlılık yok).
// ---------------------------------------------------------------------------

export const PRESET_CACHE_TAG = 'project-preset';

export interface PresetSelection {
  typography: string;
  grid: string;
  spacing: string;
  radius: string;
  density: string;
  palette: string;
}

/**
 * Güvenli default — scaffolder preset geçmediyse veya DB'den veri
 * okunamıyorsa kullanılır. Merkez/balanced kombinasyon, her sektörle uyumlu.
 */
export const DEFAULT_PRESET: PresetSelection = {
  typography: 'type-modern',
  grid: 'grid-balanced',
  spacing: 'space-default',
  radius: 'radius-soft',
  density: 'density-moderate',
  palette: 'palette-neutral-slate',
};

async function fetchFromSupabase(): Promise<PresetSelection | null> {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return null;

  let tenantId: string;
  let projectId: string | null;
  try {
    tenantId = getTenantId();
    projectId = getProjectId();
  } catch {
    return null;
  }
  if (!projectId) return null;

  try {
    const supabase = getAdminSupabase();
    const { data, error } = await supabase
      .from('projects')
      .select('preset_selection')
      .eq('id', projectId)
      .eq('tenant_id', tenantId)
      .maybeSingle();

    if (error || !data || !data.preset_selection) return null;
    const raw = data.preset_selection as Record<string, unknown>;
    // Rationale alanını drop et — UI'a gerek yok. Bilinmeyen alanları yok say.
    return {
      typography: String(raw.typography ?? DEFAULT_PRESET.typography),
      grid: String(raw.grid ?? DEFAULT_PRESET.grid),
      spacing: String(raw.spacing ?? DEFAULT_PRESET.spacing),
      radius: String(raw.radius ?? DEFAULT_PRESET.radius),
      density: String(raw.density ?? DEFAULT_PRESET.density),
      palette: String(raw.palette ?? DEFAULT_PRESET.palette),
    };
  } catch {
    return null;
  }
}

const loadPreset = unstable_cache(
  async (): Promise<PresetSelection> => {
    const fromDb = await fetchFromSupabase();
    return fromDb ?? DEFAULT_PRESET;
  },
  ['project-preset-load'],
  { tags: [PRESET_CACHE_TAG], revalidate: 300 }
);

/** Server component'lerde kullan. Admin kaydederse bir sonraki istekte taze. */
export const getPresetSelection = cache(loadPreset);

// ---------------------------------------------------------------------------
// H6 Sprint 14 — Animation preset loader
// ---------------------------------------------------------------------------

export const ANIMATION_CACHE_TAG = 'project-animation';
export type AnimationPreset = 'none' | 'subtle' | 'normal' | 'energetic';
export const DEFAULT_ANIMATION: AnimationPreset = 'normal';

async function fetchAnimationFromSupabase(): Promise<AnimationPreset | null> {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return null;
  let tenantId: string;
  let projectId: string | null;
  try {
    tenantId = getTenantId();
    projectId = getProjectId();
  } catch {
    return null;
  }
  if (!projectId) return null;

  try {
    const supabase = getAdminSupabase();
    const { data, error } = await supabase
      .from('projects')
      .select('preset_animation')
      .eq('id', projectId)
      .eq('tenant_id', tenantId)
      .maybeSingle();

    if (error || !data || !data.preset_animation) return null;
    const val = String(data.preset_animation);
    if (['none', 'subtle', 'normal', 'energetic'].includes(val)) {
      return val as AnimationPreset;
    }
    return null;
  } catch {
    return null;
  }
}

const loadAnimation = unstable_cache(
  async (): Promise<AnimationPreset> => {
    const fromDb = await fetchAnimationFromSupabase();
    return fromDb ?? DEFAULT_ANIMATION;
  },
  ['project-animation-load'],
  { tags: [ANIMATION_CACHE_TAG], revalidate: 300 }
);

export const getAnimationPreset = cache(loadAnimation);
