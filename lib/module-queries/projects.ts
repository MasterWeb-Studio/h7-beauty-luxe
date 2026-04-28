import type { ProjectsRow } from '@/lib/types/projects';

import { getAdminSupabase } from '@/lib/supabase-admin';

// Sprint 24 G3 — gerçek Supabase implementasyonu.
const PROJECT_ID = process.env.NEXT_PUBLIC_PROJECT_ID;
/**
 * Resolved path result — discriminated union
 */
export type ResolvedProjectsPath =
  | { type: 'not_found' }
  | { type: 'item'; item: ProjectsRow }
  | {
      type: 'category';
      category: { name: Record<string, string>; slug: Record<string, string> } | null;
      items: ProjectsRow[];
    };

/**
 * Fetch all published projects for list page.
 * Implementation injected by Scaffolder — replace with real Supabase/API call.
 */
export async function fetchProjectsList(
  _locale: string,
  options?: {
    categoryId?: string;
    featured?: boolean;
    limit?: number;
    offset?: number;
  },
): Promise<ProjectsRow[]> {
  if (!PROJECT_ID) return [];
  const supabase = getAdminSupabase();
  const { data } = await supabase
    .from('module_projects')
    .select('*')
    .eq('project_id', PROJECT_ID)
    .not('published_at', 'is', null)
    .lte('published_at', new Date().toISOString())
    .order('sort_order', { ascending: true });
  return (data ?? []) as ProjectsRow[];
}

/**
 * Fetch featured projects for home sections.
 */
export async function fetchFeaturedProjects(
  _locale: string,
  limit = 6,
): Promise<ProjectsRow[]> {
  // TODO: Scaffolder replaces this with real implementation
  // Example:
  // const { data } = await supabase
  //   .from('module_projects')
  //   .select('*')
  //   .eq('is_featured', true)
  //   .not('published_at', 'is', null)
  //   .lte('published_at', new Date().toISOString())
  //   .order('completion_date', { ascending: false })
  //   .limit(limit);
  // return data ?? [];
  void limit;
  return [];
}

/**
 * Resolve a catch-all slug array to a page type.
 *
 * URL patterns (categories enabled, maxDepth=2):
 *   /projects                        → list (handled by page.tsx)
 *   /projects/[cat-slug]             → category page
 *   /projects/[cat-slug]/[sub-slug]  → sub-category page
 *   /projects/[cat-slug]/[item-slug] → item detail (slug match wins)
 *   /projects/[item-slug]            → item detail (no category)
 *
 * Resolution strategy:
 *   1. Try to match last segment as item slug → item
 *   2. Try to match full slug path as category → category
 *   3. not_found
 */
export async function resolveProjectsPath(
  locale: string,
  slug: string[],
): Promise<ResolvedProjectsPath> {
  if (!slug || slug.length === 0) {
    // Fallback — list handled by index page, but guard here
    return { type: 'category', category: null, items: await fetchProjectsList(locale) };
  }

  // TODO: Scaffolder replaces this with real implementation
  // Pseudocode:
  //
  // const lastSegment = slug[slug.length - 1];
  //
  // // 1. Try item match by slug
  // const { data: itemData } = await supabase
  //   .from('module_projects')
  //   .select('*')
  //   .contains('slug', { [locale]: lastSegment })
  //   .not('published_at', 'is', null)
  //   .lte('published_at', new Date().toISOString())
  //   .maybeSingle();
  //
  // if (itemData) return { type: 'item', item: itemData };
  //
  // // 2. Try category match
  // const categorySlug = slug[slug.length - 1];
  // const { data: catData } = await supabase
  //   .from('module_project_categories')
  //   .select('*')
  //   .contains('slug', { [locale]: categorySlug })
  //   .maybeSingle();
  //
  // if (catData) {
  //   const items = await fetchProjectsList(locale, { categoryId: catData.id });
  //   return { type: 'category', category: catData, items };
  // }
  //
  // return { type: 'not_found' };

  void locale;
  void slug;
  return { type: 'not_found' };
}

/**
 * Fetch related projects (same category).
 */
export async function fetchRelatedProjects(
  _locale: string,
  _currentProjectId: string,
  _categoryId: string | null,
  limit = 3,
): Promise<ProjectsRow[]> {
  // TODO: Scaffolder replaces this with real implementation
  void limit;
  return [];
}
