import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { NewsInsertSchema } from '@/lib/schemas/news';
import { getSupabaseAdmin, getProjectTenantIds } from '@/lib/supabase-admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get('page') ?? '1');
  const pageSize = Math.min(Number(searchParams.get('pageSize') ?? '50'), 200);
  const search = searchParams.get('search') ?? '';
  const categoryId = searchParams.get('category_id') ?? '';
  const author = searchParams.get('author') ?? '';
  const dateFrom = searchParams.get('date_from') ?? '';
  const dateTo = searchParams.get('date_to') ?? '';

  const supabase = getSupabaseAdmin();
  const { tenantId, projectId } = await getProjectTenantIds();

  let q = supabase
    .from('module_news')
    .select('*', { count: 'exact' })
    .eq('tenant_id', tenantId)
    .eq('project_id', projectId)
    .order('published_at', { ascending: false });

  if (search) {
    q = q.or(
      `title->>tr.ilike.%${search}%,title->>en.ilike.%${search}%,excerpt->>tr.ilike.%${search}%,excerpt->>en.ilike.%${search}%`
    );
  }

  if (categoryId) q = q.eq('category_id', categoryId);
  if (author) q = q.ilike('author', `%${author}%`);
  if (dateFrom) q = q.gte('published_at', dateFrom);
  if (dateTo) q = q.lte('published_at', dateTo);

  q = q.range((page - 1) * pageSize, page * pageSize - 1);

  const { data, count, error } = await q;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ items: data, total: count ?? 0 });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = NewsInsertSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Geçersiz veri', issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const supabase = getSupabaseAdmin();
  const { tenantId, projectId } = await getProjectTenantIds();

  const { data, error } = await supabase
    .from('module_news')
    .insert({ ...parsed.data, tenant_id: tenantId, project_id: projectId })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  revalidatePath('/', 'layout');
  return NextResponse.json({ ok: true, item: data }, { status: 201 });
}
