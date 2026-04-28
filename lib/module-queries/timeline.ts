import type { TimelineRow } from '@/lib/types/timeline';

import { getAdminSupabase } from '@/lib/supabase-admin';

// Sprint 24 G3 — gerçek Supabase implementasyonu.
const PROJECT_ID = process.env.NEXT_PUBLIC_PROJECT_ID;
export type TimelineResolved =
  | { type: 'not_found' }
  | { type: 'item'; item: TimelineRow }
  | { type: 'list'; items: TimelineRow[] };

/**
 * Fetch all published timeline events ordered by year DESC, month DESC.
 * Real implementation injected by Scaffolder — this is a typed placeholder.
 */
export async function fetchTimelineList(
  locale: string,
  limit?: number,
): Promise<TimelineRow[]> {
  if (!PROJECT_ID) return [];
  const supabase = getAdminSupabase();
  const { data } = await supabase
    .from('module_timeline')
    .select('*')
    .eq('project_id', PROJECT_ID)
    .not('published_at', 'is', null)
    .lte('published_at', new Date().toISOString())
    .order('year', { ascending: false })
    .order('month', { ascending: true });
  return (data ?? []) as TimelineRow[];
}

/**
 * Fetch a limited set of timeline events for home section variants.
 */
export async function fetchTimelineForHome(
  locale: string,
  count: number,
): Promise<TimelineRow[]> {
  return fetchTimelineList(locale, count);
}
