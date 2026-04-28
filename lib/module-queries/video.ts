import type { VideoRow } from '@/lib/types/video';

import { getAdminSupabase } from '@/lib/supabase-admin';

// Sprint 24 G3 — gerçek Supabase implementasyonu.
const PROJECT_ID = process.env.NEXT_PUBLIC_PROJECT_ID;
export type VideoPathResolved =
  | { type: 'item'; item: VideoRow }
  | { type: 'list'; items: VideoRow[] }
  | { type: 'not_found' };

/**
 * Fetch all published videos ordered by sort_order.
 * Real implementation injected by Scaffolder.
 */
export async function fetchVideoList(_locale: string): Promise<VideoRow[]> {
  if (!PROJECT_ID) return [];
  const supabase = getAdminSupabase();
  const { data } = await supabase
    .from('module_video')
    .select('*')
    .eq('project_id', PROJECT_ID)
    .not('published_at', 'is', null)
    .lte('published_at', new Date().toISOString())
    .order('sort_order', { ascending: true });
  return (data ?? []) as VideoRow[];
}

/**
 * Fetch featured videos (is_featured = true), ordered by sort_order.
 */
export async function fetchFeaturedVideoList(
  _locale: string,
  limit = 6,
): Promise<VideoRow[]> {
  if (!PROJECT_ID) return [];
  const supabase = getAdminSupabase();
  const { data } = await supabase
    .from('module_video')
    .select('*')
    .eq('project_id', PROJECT_ID)
    .eq('is_featured', true)
    .not('published_at', 'is', null)
    .lte('published_at', new Date().toISOString())
    .order('sort_order', { ascending: true })
    .limit(limit);
  return (data ?? []) as VideoRow[];
}

/**
 * Resolve a slug array to an item or list.
 * categories.enabled = false → single-segment slug maps to item id/slug.
 */
export async function resolveVideoPath(
  _locale: string,
  slug: string[],
): Promise<VideoPathResolved> {
  if (!slug || slug.length === 0) {
    return { type: 'list', items: [] };
  }

  // TODO: replace with actual Supabase / API call
  // const identifier = slug[slug.length - 1];
  // const { data } = await supabase
  //   .from('module_video')
  //   .select('*')
  //   .or(`id.eq.${identifier},slug->>${_locale}.eq.${identifier},slug->>tr.eq.${identifier}`)
  //   .not('published_at', 'is', null)
  //   .lte('published_at', new Date().toISOString())
  //   .maybeSingle();
  // if (!data) return { type: 'not_found' };
  // return { type: 'item', item: data };

  return { type: 'not_found' };
}
