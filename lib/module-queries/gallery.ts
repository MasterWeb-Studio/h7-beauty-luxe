import type { GalleryRow } from '@/lib/types/gallery';

import { getAdminSupabase } from '@/lib/supabase-admin';

// Sprint 24 G3 — gerçek Supabase implementasyonu.
const PROJECT_ID = process.env.NEXT_PUBLIC_PROJECT_ID;
// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CategoryNode {
  id: string;
  name: Record<string, string>;
  slug: Record<string, string>;
  parent_id: string | null;
  children?: CategoryNode[];
}

export type ResolvedGalleryPath =
  | { type: 'not_found' }
  | { type: 'item'; item: GalleryRow }
  | { type: 'category'; category: CategoryNode | null; items: GalleryRow[] };

// ---------------------------------------------------------------------------
// fetchGalleryList
// Returns all published gallery items, newest first.
// Real implementation: replace with Supabase / fetch call.
// ---------------------------------------------------------------------------

export async function fetchGalleryList(
  locale: string,
  options?: {
    categoryId?: string;
    limit?: number;
    offset?: number;
    sort?: 'newest' | 'taken-newest';
  }
): Promise<GalleryRow[]> {
  if (!PROJECT_ID) return [];
  const supabase = getAdminSupabase();
  const { data } = await supabase
    .from('module_gallery')
    .select('*')
    .eq('project_id', PROJECT_ID)
    .not('published_at', 'is', null)
    .lte('published_at', new Date().toISOString())
    .order('published_at', { ascending: false });
  return (data ?? []) as GalleryRow[];
}

// ---------------------------------------------------------------------------
// fetchGalleryLatest
// Used by home section variants.
// ---------------------------------------------------------------------------

export async function fetchGalleryLatest(
  locale: string,
  count: number = 6
): Promise<GalleryRow[]> {
  return fetchGalleryList(locale, { limit: count, sort: 'newest' });
}

// ---------------------------------------------------------------------------
// resolveGalleryPath
// Resolves [...slug] segments to item | category | not_found.
//
// URL patterns (categories.hierarchical = true, maxDepth = 2):
//   /gallery/[cat-slug]              → category page
//   /gallery/[cat-slug]/[sub-slug]   → sub-category page
//   /gallery/[cat-slug]/[item-slug]  → item detail (cat + item slug)
//   /gallery/[item-slug]             → item detail (no category)
// ---------------------------------------------------------------------------

export async function resolveGalleryPath(
  locale: string,
  slug: string[]
): Promise<ResolvedGalleryPath> {
  if (!slug || slug.length === 0) return { type: 'not_found' };

  // TODO: implement with Supabase client
  // Strategy:
  //   1. Try to find an item whose slug[locale] matches the last segment.
  //   2. If found, verify parent category segments match (if any).
  //   3. If not found as item, try to find a category matching the full path.
  //   4. If category found, return its child items.
  //   5. Otherwise return not_found.
  //
  // Example implementation sketch:
  //
  // const supabase = createServerClient();
  // const lastSegment = slug[slug.length - 1];
  //
  // // Try item match
  // const { data: itemData } = await supabase
  //   .from('module_gallery')
  //   .select('*')
  //   .not('published_at', 'is', null)
  //   .lte('published_at', new Date().toISOString())
  //   .contains('slug', { [locale]: lastSegment })
  //   .maybeSingle();
  //
  // if (itemData) return { type: 'item', item: itemData as GalleryRow };
  //
  // // Try category match
  // const { data: catData } = await supabase
  //   .from('module_gallery_categories')
  //   .select('*')
  //   .contains('slug', { [locale]: lastSegment })
  //   .maybeSingle();
  //
  // if (catData) {
  //   const { data: catItems } = await supabase
  //     .from('module_gallery')
  //     .select('*')
  //     .eq('category_id', catData.id)
  //     .not('published_at', 'is', null)
  //     .lte('published_at', new Date().toISOString())
  //     .order('published_at', { ascending: false });
  //   return { type: 'category', category: catData as CategoryNode, items: catItems ?? [] };
  // }
  //
  // return { type: 'not_found' };

  return { type: 'not_found' };
}
