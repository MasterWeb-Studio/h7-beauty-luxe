import type { ProductRow } from '@/lib/types/products';

import { getAdminSupabase } from '@/lib/supabase-admin';

// Sprint 24 G3 — gerçek Supabase implementasyonu.
const PROJECT_ID = process.env.NEXT_PUBLIC_PROJECT_ID;
// ─── Types ────────────────────────────────────────────────────────────────────

export interface ProductListOptions {
  page?: number;
  pageSize?: number;
  sort?: 'newest' | 'price-asc' | 'price-desc' | 'bestseller' | string;
  categoryId?: string;
  stockStatus?: string;
  priceMin?: number;
  priceMax?: number;
}

export interface ProductListResult {
  items: ProductRow[];
  total: number;
}

export type ResolvedProductPath =
  | { type: 'item'; item: ProductRow }
  | { type: 'category'; category: { id: string; name: Record<string, string> } | null; items: ProductRow[] }
  | { type: 'not_found' };

// ─── fetchProductList ─────────────────────────────────────────────────────────
/**
 * Fetches a paginated, filtered, sorted list of published products.
 * Implementation is injected by the Scaffolder — this file is a typed placeholder.
 *
 * @param locale  Active locale (e.g. 'tr' | 'en')
 * @param options Pagination / filter / sort options
 */
export async function fetchProductList(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  locale: string,
  options: ProductListOptions = {},
): Promise<ProductListResult> {
  if (!PROJECT_ID) return { items: [], total: 0 };
  const supabase = getAdminSupabase();
  const pageSize = options.pageSize ?? 20;
  const page = options.page ?? 1;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  let query = supabase
    .from('module_products')
    .select('*', { count: 'exact' })
    .eq('project_id', PROJECT_ID)
    .not('published_at', 'is', null)
    .lte('published_at', new Date().toISOString());
  if (options.categoryId) query = query.eq('category_id', options.categoryId);
  if (options.sort === 'price-asc') query = query.order('price', { ascending: true });
  else if (options.sort === 'price-desc') query = query.order('price', { ascending: false });
  else query = query.order('sort_order', { ascending: true });
  const { data, count } = await query.range(from, to);
  return { items: (data ?? []) as ProductRow[], total: count ?? 0 };
}

// ─── fetchProductBestsellers ──────────────────────────────────────────────────
/**
 * Fetches bestseller products for home section variants.
 *
 * @param locale Active locale
 * @param count  Max number of items to return (default 4)
 */
export async function fetchProductBestsellers(
  locale: string,
  count = 4,
): Promise<ProductRow[]> {
  void locale;
  void count;
  return [];
}

// ─── fetchProductLatest ───────────────────────────────────────────────────────
/**
 * Fetches the latest published products for home section variants.
 *
 * @param locale Active locale
 * @param count  Max number of items to return (default 6)
 */
export async function fetchProductLatest(
  locale: string,
  count = 6,
): Promise<ProductRow[]> {
  void locale;
  void count;
  return [];
}

// ─── resolveProductPath ───────────────────────────────────────────────────────
/**
 * Resolves a catch-all slug array to either:
 *   - a single product item  (last segment matches a product slug)
 *   - a category page        (all segments are category slugs)
 *   - not_found
 *
 * Slug resolution strategy (right-to-left):
 *   1. Try to match the full slug array as a product slug in the given locale.
 *   2. If no product found, try to match as a category path (hierarchical, maxDepth 4).
 *   3. If neither matches, return { type: 'not_found' }.
 *
 * @param locale Active locale
 * @param slug   Catch-all segments from [...slug]
 */
export async function resolveProductPath(
  locale: string,
  slug: string[],
): Promise<ResolvedProductPath> {
  void locale;
  void slug;
  // Scaffolder replaces this body.
  return { type: 'not_found' };
}
