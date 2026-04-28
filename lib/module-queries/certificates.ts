import type { CertificateRow } from '@/lib/types/certificates';

import { getAdminSupabase } from '@/lib/supabase-admin';

// Sprint 24 G3 — gerçek Supabase implementasyonu.
const PROJECT_ID = process.env.NEXT_PUBLIC_PROJECT_ID;
// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ResolvedCertificatePath =
  | { type: 'item'; item: CertificateRow }
  | { type: 'list'; items: CertificateRow[] }
  | { type: 'not_found' };

// ---------------------------------------------------------------------------
// fetchCertificateList
// Returns all published certificates ordered by sort_order ASC
// Real implementation: replace with Supabase / fetch call
// ---------------------------------------------------------------------------

export async function fetchCertificateList(
  locale: string,
): Promise<CertificateRow[]> {
  if (!PROJECT_ID) return [];
  const supabase = getAdminSupabase();
  const { data } = await supabase
    .from('module_certificates')
    .select('*')
    .eq('project_id', PROJECT_ID)
    .not('published_at', 'is', null)
    .lte('published_at', new Date().toISOString())
    .order('issue_date', { ascending: true });
  return (data ?? []) as CertificateRow[];
}

// ---------------------------------------------------------------------------
// fetchCertificateBySlug
// Looks up a single certificate by locale-aware slug
// ---------------------------------------------------------------------------

export async function fetchCertificateBySlug(
  locale: string,
  slug: string,
): Promise<CertificateRow | null> {
  // TODO: implement with Supabase client
  // Example (JSONB slug field):
  // const { data, error } = await supabase
  //   .from('module_certificates')
  //   .select('*')
  //   .eq(`slug->>${locale}`, slug)
  //   .not('published_at', 'is', null)
  //   .lte('published_at', new Date().toISOString())
  //   .single();
  // if (error) return null;
  // return data;
  void locale;
  void slug;
  return null;
}

// ---------------------------------------------------------------------------
// fetchLatestCertificates
// Used by home section variants (latest selection logic)
// ---------------------------------------------------------------------------

export async function fetchLatestCertificates(
  locale: string,
  count: number = 8,
): Promise<CertificateRow[]> {
  // TODO: implement with Supabase client
  // Example:
  // const { data, error } = await supabase
  //   .from('module_certificates')
  //   .select('*')
  //   .not('published_at', 'is', null)
  //   .lte('published_at', new Date().toISOString())
  //   .order('issue_date', { ascending: false })
  //   .limit(count);
  // if (error) throw error;
  // return data ?? [];
  void locale;
  void count;
  return [];
}

// ---------------------------------------------------------------------------
// fetchManualCertificates
// Used by home section variants (manual selection logic)
// ids: array of certificate UUIDs in desired display order
// ---------------------------------------------------------------------------

export async function fetchManualCertificates(
  locale: string,
  ids: string[],
): Promise<CertificateRow[]> {
  // TODO: implement with Supabase client
  // Example:
  // const { data, error } = await supabase
  //   .from('module_certificates')
  //   .select('*')
  //   .in('id', ids)
  //   .not('published_at', 'is', null)
  //   .lte('published_at', new Date().toISOString());
  // if (error) throw error;
  // Preserve manual order:
  // const map = new Map((data ?? []).map((r) => [r.id, r]));
  // return ids.map((id) => map.get(id)).filter(Boolean) as CertificateRow[];
  void locale;
  void ids;
  return [];
}

// ---------------------------------------------------------------------------
// resolveCertificatePath
// categories.enabled === false → single slug segment only
// slug[0] = certificate slug
// ---------------------------------------------------------------------------

export async function resolveCertificatePath(
  locale: string,
  slug: string[],
): Promise<ResolvedCertificatePath> {
  if (!slug || slug.length === 0) {
    const items = await fetchCertificateList(locale);
    return { type: 'list', items };
  }

  // categories disabled — only single-segment slugs are valid
  if (slug.length === 1) {
    const item = await fetchCertificateBySlug(locale, slug[0]);
    if (!item) return { type: 'not_found' };
    return { type: 'item', item };
  }

  // Multi-segment slug with no categories → not found
  return { type: 'not_found' };
}
