import type { CareerRow } from '@/lib/types/career';

import { getAdminSupabase } from '@/lib/supabase-admin';

// Sprint 24 G3 — gerçek Supabase implementasyonu.
const PROJECT_ID = process.env.NEXT_PUBLIC_PROJECT_ID;
// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type CareerPathResolved =
  | { type: 'item'; item: CareerRow }
  | { type: 'list'; items: CareerRow[] }
  | { type: 'not_found' };

// ---------------------------------------------------------------------------
// fetchCareerList
// Returns all active + published career items for the given locale.
// Real implementation injected by Scaffolder — this is a typed placeholder.
// ---------------------------------------------------------------------------

export async function fetchCareerList(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  locale: string,
): Promise<CareerRow[]> {
  if (!PROJECT_ID) return [];
  const supabase = getAdminSupabase();
  const { data } = await supabase
    .from('module_career')
    .select('*')
    .eq('project_id', PROJECT_ID)
    .not('published_at', 'is', null)
    .lte('published_at', new Date().toISOString())
    .order('created_at', { ascending: true });
  return (data ?? []) as CareerRow[];
}

// ---------------------------------------------------------------------------
// resolveCareerPath
// Resolves a catch-all slug array to a typed result.
//
// Since categories.enabled === false, the URL pattern is flat:
//   /career/[slug]  →  single item
//   /career         →  list (handled by list page, but guard here too)
// ---------------------------------------------------------------------------

export async function resolveCareerPath(
  locale: string,
  slug: string[],
): Promise<CareerPathResolved> {
  if (!slug || slug.length === 0) {
    const items = await fetchCareerList(locale);
    return { type: 'list', items };
  }

  // Flat: last segment is the item slug
  const itemSlug = slug[slug.length - 1];

  // TODO: Replace with actual Supabase / API call.
  // Example:
  // const { data } = await supabase
  //   .from('module_career')
  //   .select('*')
  //   .eq('project_id', PROJECT_ID)
  //   .eq('is_active', true)
  //   .not('published_at', 'is', null)
  //   .lte('published_at', new Date().toISOString())
  //   .contains('slug', { [locale]: itemSlug })
  //   .single();
  // if (!data) return { type: 'not_found' };
  // return { type: 'item', item: data };

  void itemSlug; // placeholder — remove when implementing
  return { type: 'not_found' };
}
