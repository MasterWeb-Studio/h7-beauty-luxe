import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { ReferencesInsertSchema } from '@/lib/schemas/references';
import { getSupabaseAdmin, getProjectTenantIds } from '@/lib/supabase-admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get('page') ?? '1');
  const pageSize = Math.min(Number(searchParams.get('pageSize') ?? '100'), 200);
  const search = searchParams.get('search') ?? '';

  const supabase = getSupabaseAdmin();
  const { tenantId, projectId } = await getProjectTenantIds();

  let q = supabase
    .from('module_references')
    .select('*', { count: 'exact' })
    .eq('tenant_id', tenantId)
    .eq('project_id', projectId)
    .order('sort_order', { ascending: true });

  if (search) q = q.ilike('name', `%${search}%`);

  q = q.range((page - 1) * pageSize, page * pageSize - 1);

  const { data, count, error } = await q;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ items: data, total: count ?? 0 });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = ReferencesInsertSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Geçersiz veri', issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const supabase = getSupabaseAdmin();
  const { tenantId, projectId } = await getProjectTenantIds();

  const { data, error } = await supabase
    .from('module_references')
    .insert({ ...parsed.data, tenant_id: tenantId, project_id: projectId })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  revalidatePath('/', 'layout');
  return NextResponse.json({ ok: true, item: data }, { status: 201 });
}
