// ---------------------------------------------------------------------------
// H6 Sprint 12 — Supabase Storage helper
//
// Bucket: 'project-media' (public read, service role write).
// Kurulum: Supabase Dashboard → Storage → Create bucket.
//   - Name: project-media
//   - Public: Yes (getPublicUrl çalışsın, RLS API seviyesinde)
//   - File size limit: 10 MB (admin form)
//   - Allowed MIME: image/* (frontend form validasyonu ile birlikte)
//
// Path şeması (H6 Sprint 13 hibrit model):
//   - Global medya:    project-media/<projectId>/global/<category>/<uuid>.<ext>
//   - Modüle özel:     project-media/<projectId>/<moduleId>/<recordId>/<uuid>.<ext>
//
// Silme / güncelleme: service role gerekir — API route seviyesinde denetlenir.
// ---------------------------------------------------------------------------

import type { SupabaseClient } from '@supabase/supabase-js';
import { randomUUID } from 'node:crypto';

export const DEFAULT_BUCKET = 'project-media';

export interface StoragePutOptions {
  /** Default 'project-media' */
  bucket?: string;
  /** Service-role client; test/override için inject edilebilir. */
  client?: SupabaseClient;
  /** MIME hint — yoksa Blob'dan okunur. */
  contentType?: string;
  /** Cache control — default '31536000' (1 yıl; CDN-friendly). */
  cacheControl?: string;
}

export interface UploadedMedia {
  bucket: string;
  path: string;
  publicUrl: string;
}

/** Path builder — global medya (projeye özel ama modüle bağlı değil). */
export function buildGlobalMediaPath(params: {
  projectId: string;
  category: string;
  ext: string;
}): string {
  const { projectId, category, ext } = params;
  const uuid = randomUUID();
  return `${projectId}/global/${sanitize(category)}/${uuid}.${sanitize(ext)}`;
}

/** Path builder — modüle özel medya (ürün görseli, galeri öğesi). */
export function buildModuleMediaPath(params: {
  projectId: string;
  moduleId: string;
  recordId: string;
  ext: string;
}): string {
  const { projectId, moduleId, recordId, ext } = params;
  const uuid = randomUUID();
  return `${projectId}/${sanitize(moduleId)}/${sanitize(recordId)}/${uuid}.${sanitize(ext)}`;
}

/** Dosyayı Supabase Storage'a yükler, public URL döner. */
export async function uploadToStorage(
  client: SupabaseClient,
  path: string,
  data: Buffer | Uint8Array | Blob,
  opts: StoragePutOptions = {}
): Promise<UploadedMedia> {
  const bucket = opts.bucket ?? DEFAULT_BUCKET;
  const { error } = await client.storage.from(bucket).upload(path, data, {
    contentType: opts.contentType,
    cacheControl: opts.cacheControl ?? '31536000',
    upsert: false,
  });
  if (error) {
    throw new Error(`Storage upload hata: ${error.message}`);
  }
  const { data: pub } = client.storage.from(bucket).getPublicUrl(path);
  return {
    bucket,
    path,
    publicUrl: pub.publicUrl,
  };
}

/** Public URL helper — path'i upload edilmiş bir obje için URL'e çevirir. */
export function getPublicUrl(
  client: SupabaseClient,
  path: string,
  bucket: string = DEFAULT_BUCKET
): string {
  const { data } = client.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

/** Obje sil — admin delete için. */
export async function deleteFromStorage(
  client: SupabaseClient,
  path: string,
  bucket: string = DEFAULT_BUCKET
): Promise<void> {
  const { error } = await client.storage.from(bucket).remove([path]);
  if (error) {
    throw new Error(`Storage delete hata: ${error.message}`);
  }
}

/** Extension helper — image/jpeg → jpg, image/png → png, image/webp → webp. */
export function mimeToExt(mime: string): string {
  const map: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/gif': 'gif',
    'image/svg+xml': 'svg',
    'image/avif': 'avif',
  };
  return map[mime.toLowerCase()] ?? 'bin';
}

function sanitize(s: string): string {
  return s.replace(/[^a-z0-9._-]/gi, '-').replace(/-+/g, '-').toLowerCase();
}
