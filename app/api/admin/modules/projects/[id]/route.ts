import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { ProjectsUpdateSchema } from '@/lib/schemas/projects';
import { getSupabaseAdmin, getProjectTenantIds } from '@/lib/supabase-admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = getSupabaseAdmin();
  const { tenantId, projectId } = await getProjectTenantIds();

  const { data, error } = await supabase
    .from('module_projects')
    .select('*')
    .eq('id', id)
    .eq('tenant_id', tenantId)
    .eq('project_id', projectId)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json({ item: data });
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parsed = ProjectsUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Geçersiz veri', issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const supabase = getSupabaseAdmin();
  const { tenantId, projectId } = await getProjectTenantIds();

  const { error } = await supabase
    .from('module_projects')
    .update(parsed.data)
    .eq('id', id)
    .eq('tenant_id', tenantId)
    .eq('project_id', projectId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  revalidatePath('/', 'layout');
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = getSupabaseAdmin();
  const { tenantId, projectId } = await getProjectTenantIds();

  const { error } = await supabase
    .from('module_projects')
    .delete()
    .eq('id', id)
    .eq('tenant_id', tenantId)
    .eq('project_id', projectId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  revalidatePath('/', 'layout');
  return NextResponse.json({ ok: true });
}
