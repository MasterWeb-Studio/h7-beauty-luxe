import { NextResponse } from 'next/server';
import {
  getAdminSupabase,
  getProjectId,
  getTenantId,
} from '../../../../../lib/supabase-admin';

// ---------------------------------------------------------------------------
// H5 Ayak C Gün 3 — Ticket statü güncelleme.
// PATCH /api/admin/support-tickets/:id
// ---------------------------------------------------------------------------

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  if (!id) {
    return NextResponse.json({ error: 'Ticket id gerekli.' }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Geçersiz JSON.' }, { status: 400 });
  }

  const { status } = (body ?? {}) as { status?: unknown };
  if (status !== 'open' && status !== 'resolved') {
    return NextResponse.json(
      { error: "'status' 'open' veya 'resolved' olmalı." },
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
      { error: err instanceof Error ? err.message : 'Tenant env eksik.' },
      { status: 500 }
    );
  }
  if (!projectId) {
    return NextResponse.json(
      { error: 'NEXT_PUBLIC_PROJECT_ID env eksik.' },
      { status: 500 }
    );
  }

  const supabase = getAdminSupabase();
  const update: Record<string, unknown> = {
    status,
    resolved_at: status === 'resolved' ? new Date().toISOString() : null,
  };

  const { data, error } = await supabase
    .from('support_tickets')
    .update(update)
    .eq('id', id)
    .eq('tenant_id', tenantId)
    .eq('project_id', projectId)
    .select('id, subject, body, status, created_at, resolved_at')
    .maybeSingle();

  if (error) {
    return NextResponse.json(
      { error: `Ticket güncellenemedi: ${error.message}` },
      { status: 500 }
    );
  }
  if (!data) {
    return NextResponse.json(
      { error: 'Ticket bulunamadı veya bu projeye ait değil.' },
      { status: 404 }
    );
  }

  return NextResponse.json({ ok: true, ticket: data }, { status: 200 });
}
