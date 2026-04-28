import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { NoteBodySchema } from '../../../../../../lib/crm-schemas';
import {
  getAdminSupabase,
  getProjectId,
  getTenantId,
} from '../../../../../../lib/supabase-admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ error: 'Geçersiz JSON.' }, { status: 400 });
  }

  const parsed = NoteBodySchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Not boş olamaz.' },
      { status: 400 }
    );
  }

  let tenantId: string;
  let projectId: string | null;
  try {
    tenantId = getTenantId();
    projectId = getProjectId();
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Env eksik.' },
      { status: 500 }
    );
  }

  try {
    const supabase = getAdminSupabase();

    // Önce lead var mı ve bu tenant/project'e mi ait — güvenlik + 404 ayrımı
    let verify = supabase.from('crm_leads').select('id').eq('id', id).eq('tenant_id', tenantId);
    if (projectId) verify = verify.eq('project_id', projectId);
    const { data: lead, error: verifyErr } = await verify.maybeSingle();
    if (verifyErr) return NextResponse.json({ error: verifyErr.message }, { status: 500 });
    if (!lead) return NextResponse.json({ error: 'Lead bulunamadı.' }, { status: 404 });

    const { error: insertErr, data } = await supabase
      .from('crm_notes')
      .insert({
        tenant_id: tenantId,
        parent_type: 'lead',
        parent_id: id,
        body: parsed.data.body,
      })
      .select('id, created_at')
      .single();

    if (insertErr) {
      return NextResponse.json({ error: insertErr.message }, { status: 500 });
    }

    revalidatePath(`/admin/leads/${id}`);
    return NextResponse.json({ ok: true, note: data }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Bilinmeyen hata.' },
      { status: 500 }
    );
  }
}
