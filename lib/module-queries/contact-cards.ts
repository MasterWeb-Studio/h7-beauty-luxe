import type { ContactCardRow } from '@/lib/types/contact-cards';

import { getAdminSupabase } from '@/lib/supabase-admin';

// Sprint 24 G3 — gerçek Supabase implementasyonu.
const PROJECT_ID = process.env.NEXT_PUBLIC_PROJECT_ID;
/**
 * Fetches all published contact cards for a given locale, ordered by sort_order.
 * Real implementation is injected by Scaffolder — this is a typed placeholder.
 */
export async function fetchContactCardsList(
  locale: string,
  projectId?: string,
): Promise<ContactCardRow[]> {
  if (!PROJECT_ID) return [];
  const supabase = getAdminSupabase();
  const { data } = await supabase
    .from('module_contact_cards')
    .select('*')
    .eq('project_id', PROJECT_ID)
    .not('published_at', 'is', null)
    .lte('published_at', new Date().toISOString())
    .order('sort_order', { ascending: true });
  return (data ?? []) as ContactCardRow[];
}

/**
 * Fetches a limited set of contact cards for home section variants.
 * @param count  Maximum number of cards to return (defaultCount from spec).
 */
export async function fetchContactCardsForHome(
  locale: string,
  count: number,
  projectId?: string,
): Promise<ContactCardRow[]> {
  const all = await fetchContactCardsList(locale, projectId);
  return all.slice(0, count);
}
