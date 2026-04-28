// ---------------------------------------------------------------------------
// H6 Sprint 13 Gün 1 — media_library.usage_refs yönetimi
//
// Her modül CRUD işleminde (insert/update/delete) media referansları
// takip edilir. Amaç: silme koruması + /admin/media "kullanılmayan" filter.
//
// usage_refs format:
//   [{ "table": "module_products", "id": "<rec-uuid>", "field": "images" }, ...]
//
// Bir kayıt insert veya update olduğunda: eski media ref'lerin usage_refs'ı
// kaldırılır, yeni media ref'lerin usage_refs'ı eklenir. Delete'de tüm
// ref'ler kaldırılır.
// ---------------------------------------------------------------------------

import type { SupabaseClient } from '@supabase/supabase-js';

export interface UsageRef {
  table: string; // 'module_products' gibi
  id: string; // record uuid
  field: string; // 'images', 'cover_image', 'photo', ...
}

/** Bir media_library row'unun usage_refs listesine kayıt ekle (idempotent). */
export async function addMediaUsage(
  client: SupabaseClient,
  mediaId: string,
  ref: UsageRef
): Promise<void> {
  if (!mediaId) return;
  const { data, error } = await client
    .from('media_library')
    .select('usage_refs')
    .eq('id', mediaId)
    .maybeSingle();
  if (error || !data) return;
  const current: UsageRef[] = Array.isArray(data.usage_refs) ? data.usage_refs : [];
  // Idempotent: aynı (table+id+field) ref iki kez eklenmez
  const exists = current.some(
    (r) => r.table === ref.table && r.id === ref.id && r.field === ref.field
  );
  if (exists) return;
  const next = [...current, ref];
  await client.from('media_library').update({ usage_refs: next }).eq('id', mediaId);
}

/** usage_refs listesinden kayıt sil. */
export async function removeMediaUsage(
  client: SupabaseClient,
  mediaId: string,
  ref: UsageRef
): Promise<void> {
  if (!mediaId) return;
  const { data, error } = await client
    .from('media_library')
    .select('usage_refs')
    .eq('id', mediaId)
    .maybeSingle();
  if (error || !data) return;
  const current: UsageRef[] = Array.isArray(data.usage_refs) ? data.usage_refs : [];
  const next = current.filter(
    (r) => !(r.table === ref.table && r.id === ref.id && r.field === ref.field)
  );
  if (next.length === current.length) return; // değişim yok
  await client.from('media_library').update({ usage_refs: next }).eq('id', mediaId);
}

/**
 * Modül CRUD sonrası toplu sync — eski ref set'i ile yeni ref set'i
 * arasındaki farkı hesaplar, eklenenlere addMediaUsage, çıkanlara
 * removeMediaUsage çağırır.
 *
 * Kullanım (modül update route'u):
 *   await syncMediaUsage(supabase, {
 *     table: 'module_products',
 *     recordId: id,
 *     field: 'images',
 *     oldMediaIds: existingRow.images,
 *     newMediaIds: parsed.data.images,
 *   });
 */
export async function syncMediaUsage(
  client: SupabaseClient,
  opts: {
    table: string;
    recordId: string;
    field: string;
    oldMediaIds: string[] | null | undefined;
    newMediaIds: string[] | null | undefined;
  }
): Promise<void> {
  const oldSet = new Set((opts.oldMediaIds ?? []).filter(Boolean));
  const newSet = new Set((opts.newMediaIds ?? []).filter(Boolean));

  const toAdd: string[] = [];
  const toRemove: string[] = [];
  for (const id of newSet) if (!oldSet.has(id)) toAdd.push(id);
  for (const id of oldSet) if (!newSet.has(id)) toRemove.push(id);

  for (const id of toAdd) {
    await addMediaUsage(client, id, {
      table: opts.table,
      id: opts.recordId,
      field: opts.field,
    });
  }
  for (const id of toRemove) {
    await removeMediaUsage(client, id, {
      table: opts.table,
      id: opts.recordId,
      field: opts.field,
    });
  }
}

/** Bir kayıt tamamen silindiğinde: tüm media ref'ini çıkar. */
export async function clearMediaUsageForRecord(
  client: SupabaseClient,
  opts: {
    table: string;
    recordId: string;
    field: string;
    mediaIds: string[] | null | undefined;
  }
): Promise<void> {
  for (const id of (opts.mediaIds ?? []).filter(Boolean)) {
    await removeMediaUsage(client, id, {
      table: opts.table,
      id: opts.recordId,
      field: opts.field,
    });
  }
}

/** Tekil referans (media_ref field) için extract helper. */
export function extractMediaIds(value: unknown): string[] {
  if (!value) return [];
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.filter((v) => typeof v === 'string');
  return [];
}
