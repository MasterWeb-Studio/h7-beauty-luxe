import { NextResponse } from 'next/server';
import {
  uploadToStorage,
  buildGlobalMediaPath,
  buildModuleMediaPath,
  mimeToExt,
  DEFAULT_BUCKET,
} from '@studio/shared';
import { getSupabaseAdmin, getProjectTenantIds } from '@/lib/supabase-admin';

// H6 Sprint 12 — Media upload endpoint.
// FormData alır (file + category + opsiyonel moduleId/recordId), Supabase
// Storage'a yükler, media_library tablosuna kayıt düşer, MediaItem döndürür.
//
// Sharp ile auto-optimize: max 2048px long-edge, JPEG quality 82, WebP
// seçeneği. Browser içinde WebP desteği varsa client progressive yerine
// `accept: image/webp` header'ı ile srv-side serve edilebilir (H7).

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024; // 10 MB

export async function POST(req: Request) {
  const form = await req.formData().catch(() => null);
  if (!form) {
    return NextResponse.json({ error: 'multipart/form-data bekleniyor' }, { status: 400 });
  }

  const file = form.get('file');
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'Dosya yok' }, { status: 400 });
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return NextResponse.json(
      { error: 'Dosya 10MB sınırını aşıyor', size: file.size },
      { status: 413 }
    );
  }
  if (!file.type.startsWith('image/')) {
    return NextResponse.json({ error: 'Sadece image/* kabul' }, { status: 415 });
  }

  const category = (form.get('category') as string | null) ?? 'general';
  const altText = (form.get('altText') as string | null) ?? null;
  const moduleId = (form.get('moduleId') as string | null) ?? null;
  const recordId = (form.get('recordId') as string | null) ?? null;

  const supabase = getSupabaseAdmin();
  const { tenantId, projectId } = await getProjectTenantIds();

  // --- Sharp optimize (opsiyonel; dynamic import hata verirse raw upload) ---
  let buffer = Buffer.from(await file.arrayBuffer());
  let finalMime = file.type;
  let width: number | undefined;
  let height: number | undefined;
  try {
    const mod = await import('sharp');
    const sharp = mod.default;
    const image = sharp(buffer, { failOn: 'none' });
    const meta = await image.metadata();
    width = meta.width;
    height = meta.height;

    const LONG_EDGE = 2048;
    if (width && height && Math.max(width, height) > LONG_EDGE) {
      const pipeline = image.resize({
        width: width >= height ? LONG_EDGE : undefined,
        height: height > width ? LONG_EDGE : undefined,
        fit: 'inside',
        withoutEnlargement: true,
      });
      // JPEG/PNG/WebP: hafif re-encode; SVG dokunma
      if (file.type === 'image/svg+xml') {
        // skip
      } else {
        const encoded = await pipeline
          .jpeg({ quality: 82, mozjpeg: true })
          .toBuffer({ resolveWithObject: true });
        buffer = Buffer.from(encoded.data);
        finalMime = 'image/jpeg';
        width = encoded.info.width;
        height = encoded.info.height;
      }
    }
  } catch {
    // sharp yoksa raw upload
  }

  // --- Storage path ---
  const ext = mimeToExt(finalMime);
  const storagePath =
    moduleId && recordId
      ? buildModuleMediaPath({ projectId, moduleId, recordId, ext })
      : buildGlobalMediaPath({ projectId, category, ext });

  // --- Upload ---
  const { publicUrl, bucket, path } = await uploadToStorage(
    supabase,
    storagePath,
    buffer,
    { contentType: finalMime }
  );

  // --- media_library insert ---
  const { data: row, error: dbErr } = await supabase
    .from('media_library')
    .insert({
      tenant_id: tenantId,
      project_id: projectId,
      filename: file.name,
      url: publicUrl,
      storage_path: path,
      mime_type: finalMime,
      size_bytes: buffer.byteLength,
      width,
      height,
      alt_text: altText ? { tr: altText, en: altText } : null,
      category,
      source: 'upload',
      uploaded_by: 'admin',
    })
    .select()
    .single();

  if (dbErr) {
    // Storage'a yazıldı ama DB fail — orphan cleanup denemesi
    try {
      await supabase.storage.from(bucket).remove([path]);
    } catch {
      /* best-effort */
    }
    return NextResponse.json(
      { error: 'DB insert hata', detail: dbErr.message },
      { status: 500 }
    );
  }

  // --- MediaPicker uyumlu response ---
  return NextResponse.json(
    {
      ok: true,
      item: {
        id: row.id,
        url: row.url,
        thumbUrl: row.url, // Sprint 13: transform API veya storage-side derivative
        alt: row.alt_text ?? { tr: '', en: '' },
        category: row.category,
        width: row.width ?? undefined,
        height: row.height ?? undefined,
        size: row.size_bytes ?? undefined,
        fileName: row.filename,
      },
    },
    { status: 201 }
  );
}
