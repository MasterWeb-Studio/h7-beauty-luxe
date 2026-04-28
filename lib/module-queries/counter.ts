import { getAdminSupabase } from '@/lib/supabase-admin';

// Sprint 24 G3 — gerçek Supabase implementasyonu.
const PROJECT_ID = process.env.NEXT_PUBLIC_PROJECT_ID;
/**
 * module-queries/counter.ts
 *
 * Supabase / fetch helper'ları — Counter modülü.
 * Gerçek implementasyon Scaffolder tarafında bağlanır;
 * bu dosya tip-güvenli placeholder export sağlar.
 */

import type { CounterRow } from '@/lib/types/counter';

// ---------------------------------------------------------------------------
// fetchCounterList
// ---------------------------------------------------------------------------

/**
 * Yayınlanmış counter kayıtlarını sort_order ASC ile döner.
 * @param locale  Aktif locale (şu an kullanılmıyor — tüm locale verileri döner)
 * @param limit   Maksimum kayıt sayısı (opsiyonel)
 */
export async function fetchCounterList(
  _locale: string,
  limit?: number,
): Promise<CounterRow[]> {
  if (!PROJECT_ID) return [];
  const supabase = getAdminSupabase();
  let query = supabase
    .from('module_counter')
    .select('*')
    .eq('project_id', PROJECT_ID)
    .not('published_at', 'is', null)
    .lte('published_at', new Date().toISOString())
    .order('sort_order', { ascending: true });
  if (limit) query = query.limit(limit);
  const { data } = await query;
  return (data ?? []) as CounterRow[];
}
