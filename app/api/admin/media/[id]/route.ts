import { NextResponse } from 'next/server';
import { DEFAULT_BUCKET } from '@studio/shared';
import { getSupabaseAdmin, getProjectTenantIds } from '@/lib/supabase-admin';

// H6 Sprint 12+13 — Media detail/delete endpoint.
// GET  /api/admin/media/[id] → tek kayıt
// PATCH /api/admin/media/[id] → alt_text/category/tags güncelleme
// DELETE /api/admin/media/[id] → usage_refs boşsa hem DB hem Storage'dan sil.
//
// Sprint 13: silme koruması — usage_refs dolu ise 409 Conflict döner.

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = getSupabaseAdmin();
  const { tenantId, projectId } = await getProjectTenantIds();
  const { data, error } = await supabase
    .from('media_library')
    .select('*')
    .eq('id', id)
    .eq('tenant_id', tenantId)
    .eq('project_id', projectId)
    .maybeSingle();
  if (error || !data) {
    return NextResponse.json({ error: 'Bulunamadı' }, { status: 404 });
  }
  return NextResponse.json({ item: data });
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Geçersiz body' }, { status: 400 });
  }

  const allowed: Record<string, unknown> = {};
  if (body.alt_text !== undefined) allowed.alt_text = body.alt_text;
  if (body.category !== undefined) allowed.category = body.category;
  if (body.tags !== undefined) allowed.tags = body.tags;

  if (Object.keys(allowed).length === 0) {
    return NextResponse.json({ error: 'Güncellenecek alan yok' }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { tenantId, projectId } = await getProjectTenantIds();
  const { error } = await supabase
    .from('media_library')
    .update(allowed)
    .eq('id', id)
    .eq('tenant_id', tenantId)
    .eq('project_id', projectId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const url = new URL(req.url);
  const force = url.searchParams.get('force') === '1';

  const supabase = getSupabaseAdmin();
  const { tenantId, projectId } = await getProjectTenantIds();

  // Önce kaydı bul (storage_path + usage_refs için)
  const { data, error: getErr } = await supabase
    .from('media_library')
    .select('storage_path, usage_refs')
    .eq('id', id)
    .eq('tenant_id', tenantId)
    .eq('project_id', projectId)
    .maybeSingle();
  if (getErr || !data) {
    return NextResponse.json({ error: 'Bulunamadı' }, { status: 404 });
  }

  const refCount = Array.isArray(data.usage_refs) ? data.usage_refs.length : 0;
  if (refCount > 0 && !force) {
    return NextResponse.json(
      {
        error: 'Referans koruması',
        detail: `Bu görsel ${refCount} yerde kullanılıyor. Silmek için ?force=1`,
        usageCount: refCount,
      },
      { status: 409 }
    );
  }

  // Storage'dan sil (best effort — DB delete için blocking değil)
  try {
    await supabase.storage.from(DEFAULT_BUCKET).remove([data.storage_path]);
  } catch {
    /* storage delete fail, yine de DB delete */
  }

  // DB'den sil
  const { error: delErr } = await supabase
    .from('media_library')
    .delete()
    .eq('id', id)
    .eq('tenant_id', tenantId)
    .eq('project_id', projectId);
  if (delErr) return NextResponse.json({ error: delErr.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
