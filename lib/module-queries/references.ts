import type { ReferencesRow } from '@/lib/types/references';

import { getAdminSupabase } from '@/lib/supabase-admin';

// Sprint 24 G3 — gerçek Supabase implementasyonu.
const PROJECT_ID = process.env.NEXT_PUBLIC_PROJECT_ID;
/**
 * Fetch published references ordered by sort_order ASC.
 * Real implementation injected by Scaffolder (Supabase / REST / etc.).
 */
export async function fetchReferencesList(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _locale: string
): Promise<ReferencesRow[]> {
  if (!PROJECT_ID) return [];
  const supabase = getAdminSupabase();
  const { data } = await supabase
    .from('module_references')
    .select('*')
    .eq('project_id', PROJECT_ID)
    .not('published_at', 'is', null)
    .lte('published_at', new Date().toISOString())
    .order('sort_order', { ascending: true });
  return (data ?? []) as ReferencesRow[];
}

/**
 * Fetch a limited set of references for home sections.
 * `selectionLogic: 'manual'` — returns top N by sort_order.
 */
export async function fetchReferencesForHome(
  locale: string,
  count: number = 6
): Promise<ReferencesRow[]> {
  const all = await fetchReferencesList(locale);
  return all.slice(0, count);
}
