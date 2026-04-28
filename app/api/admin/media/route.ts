import { NextResponse } from 'next/server';
import { getSupabaseAdmin, getProjectTenantIds } from '@/lib/supabase-admin';

// H6 Sprint 12 — Media library list/search endpoint.
// GET /api/admin/media?category=x&search=y&page=1&pageSize=50&unused=1
// Sprint 13 adds: unused=1 filter (usage_refs empty).

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') ?? undefined;
  const search = searchParams.get('search') ?? undefined;
  const page = Math.max(1, Number(searchParams.get('page') ?? '1'));
  const pageSize = Math.min(200, Math.max(1, Number(searchParams.get('pageSize') ?? '50')));
  const unusedOnly = searchParams.get('unused') === '1';
  const moduleIdFilter = searchParams.get('moduleId') ?? undefined;

  const supabase = getSupabaseAdmin();
  const { tenantId, projectId } = await getProjectTenantIds();

  let query = supabase
    .from('media_library')
    .select('*', { count: 'exact' })
    .eq('tenant_id', tenantId)
    .eq('project_id', projectId)
    .order('uploaded_at', { ascending: false });

  if (category) query = query.eq('category', category);
  if (search) query = query.ilike('filename', `%${search}%`);
  // H6 Sprint 13 — kullanılmayan medya: usage_refs empty array
  if (unusedOnly) query = query.eq('usage_refs', '[]');
  // Modüle özel storage path prefix filter (hibrit model)
  if (moduleIdFilter) query = query.like('storage_path', `%/${moduleIdFilter}/%`);

  query = query.range((page - 1) * pageSize, page * pageSize - 1);

  const { data, count, error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const items = (data ?? []).map((row: any) => ({
    id: row.id,
    url: row.url,
    thumbUrl: row.url,
    alt: row.alt_text ?? { tr: '', en: '' },
    category: row.category ?? undefined,
    width: row.width ?? undefined,
    height: row.height ?? undefined,
    size: row.size_bytes ?? undefined,
    fileName: row.filename,
    // H6 Sprint 13 fields
    usageCount: Array.isArray(row.usage_refs) ? row.usage_refs.length : 0,
    source: row.source,
    photographer: row.photographer,
    photographerUrl: row.photographer_url,
  }));

  return NextResponse.json({ items, total: count ?? 0, page, pageSize });
}
