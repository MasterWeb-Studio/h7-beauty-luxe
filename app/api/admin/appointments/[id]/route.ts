import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { AppointmentUpdateSchema } from '../../../../../lib/crm-schemas';
import {
  getAdminSupabase,
  getProjectId,
  getTenantId,
} from '../../../../../lib/supabase-admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function PATCH(
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

  const parsed = AppointmentUpdateSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: 'Doğrulama başarısız.',
        issues: parsed.error.issues.map((i) => ({
          path: i.path.join('.'),
          message: i.message,
        })),
      },
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

  const updates: Record<string, unknown> = {};
  if (parsed.data.status !== undefined) updates.status = parsed.data.status;
  if (parsed.data.notes !== undefined) updates.notes = parsed.data.notes;

  try {
    const supabase = getAdminSupabase();
    let query = supabase
      .from('crm_appointments')
      .update(updates, { count: 'exact' })
      .eq('id', id)
      .eq('tenant_id', tenantId);
    if (projectId) query = query.eq('project_id', projectId);

    const { error, count } = await query;
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    if (count === 0) {
      return NextResponse.json({ error: 'Randevu bulunamadı.' }, { status: 404 });
    }
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Bilinmeyen hata.' },
      { status: 500 }
    );
  }

  revalidatePath('/admin/appointments');
  revalidatePath(`/admin/appointments/${id}`);
  return NextResponse.json({ ok: true }, { status: 200 });
}
