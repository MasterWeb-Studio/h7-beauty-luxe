import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { ProductInsertSchema } from '@/lib/schemas/products';
import { getSupabaseAdmin, getProjectTenantIds } from '@/lib/supabase-admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get('page') ?? '1');
  const pageSize = Math.min(Number(searchParams.get('pageSize') ?? '50'), 200);
  const search = searchParams.get('search') ?? '';
  const categoryId = searchParams.get('category_id') ?? '';
  const stockStatus = searchParams.get('stock_status') ?? '';
  const isBestseller = searchParams.get('is_bestseller') ?? '';
  const publishedFrom = searchParams.get('published_from') ?? '';
  const publishedTo = searchParams.get('published_to') ?? '';

  const supabase = getSupabaseAdmin();
  const { tenantId, projectId } = await getProjectTenantIds();

  let q = supabase
    .from('module_products')
    .select('*', { count: 'exact' })
    .eq('tenant_id', tenantId)
    .eq('project_id', projectId)
    .order('published_at', { ascending: false, nullsFirst: false });

  if (search) {
    q = q.or(`name->>tr.ilike.%${search}%,short_description->>tr.ilike.%${search}%`);
  }
  if (categoryId) {
    q = q.eq('category_id', categoryId);
  }
  if (stockStatus) {
    q = q.eq('stock_status', stockStatus);
  }
  if (isBestseller === 'true') {
    q = q.eq('is_bestseller', true);
  }
  if (publishedFrom) {
    q = q.gte('published_at', publishedFrom);
  }
  if (publishedTo) {
    q = q.lte('published_at', publishedTo);
  }

  q = q.range((page - 1) * pageSize, page * pageSize - 1);

  const { data, count, error } = await q;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ items: data, total: count ?? 0 });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = ProductInsertSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Geçersiz veri', issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const supabase = getSupabaseAdmin();
  const { tenantId, projectId } = await getProjectTenantIds();

  const { data, error } = await supabase
    .from('module_products')
    .insert({ ...parsed.data, tenant_id: tenantId, project_id: projectId })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  revalidatePath('/', 'layout');
  return NextResponse.json({ ok: true, item: data }, { status: 201 });
}
