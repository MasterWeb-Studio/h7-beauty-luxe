import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { ProjectsInsertSchema } from '@/lib/schemas/projects';
import { getSupabaseAdmin, getProjectTenantIds } from '@/lib/supabase-admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get('page') ?? '1');
  const pageSize = Math.min(Number(searchParams.get('pageSize') ?? '50'), 200);
  const search = searchParams.get('search') ?? '';
  const categoryId = searchParams.get('category_id') ?? '';
  const isFeatured = searchParams.get('is_featured') ?? '';
  const completionDateFrom = searchParams.get('completion_date_from') ?? '';
  const completionDateTo = searchParams.get('completion_date_to') ?? '';
  const sortField = searchParams.get('sort_field') ?? 'completion_date';
  const sortDir = searchParams.get('sort_dir') ?? 'desc';

  const supabase = getSupabaseAdmin();
  const { tenantId, projectId } = await getProjectTenantIds();

  let q = supabase
    .from('module_projects')
    .select('*', { count: 'exact' })
    .eq('tenant_id', tenantId)
    .eq('project_id', projectId)
    .order(sortField, { ascending: sortDir === 'asc' });

  if (search) {
    q = q.or(
      `title->>tr.ilike.%${search}%,title->>en.ilike.%${search}%,client_name.ilike.%${search}%,short_description->>tr.ilike.%${search}%`
    );
  }

  if (categoryId) {
    q = q.eq('category_id', categoryId);
  }

  if (isFeatured === 'true') {
    q = q.eq('is_featured', true);
  } else if (isFeatured === 'false') {
    q = q.eq('is_featured', false);
  }

  if (completionDateFrom) {
    q = q.gte('completion_date', completionDateFrom);
  }

  if (completionDateTo) {
    q = q.lte('completion_date', completionDateTo);
  }

  q = q.range((page - 1) * pageSize, page * pageSize - 1);

  const { data, count, error } = await q;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ items: data, total: count ?? 0 });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = ProjectsInsertSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Geçersiz veri', issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const supabase = getSupabaseAdmin();
  const { tenantId, projectId } = await getProjectTenantIds();

  const { data, error } = await supabase
    .from('module_projects')
    .insert({ ...parsed.data, tenant_id: tenantId, project_id: projectId })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  revalidatePath('/', 'layout');
  return NextResponse.json({ ok: true, item: data }, { status: 201 });
}
