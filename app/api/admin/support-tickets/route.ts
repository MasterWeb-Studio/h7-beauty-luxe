import { NextResponse } from 'next/server';
import {
  getAdminSupabase,
  getProjectId,
  getTenantId,
} from '../../../../lib/supabase-admin';
import { sendEmail } from '../../../../lib/email';

// ---------------------------------------------------------------------------
// H5 Ayak C Gün 3 — Admin destek ticket'ı.
//
// POST: yeni ticket (subject 3-200, body 10-2000). Insert sonrası Resend
// ile bildirim maili. Email başarısız olsa da ticket kaydedilir.
// GET:  filtered list (?status=open|resolved|all, ?limit=50).
//
// Middleware /api/admin/** auth'u koruyor — explicit check yok.
// ---------------------------------------------------------------------------

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface TicketRow {
  id: string;
  subject: string;
  body: string;
  status: 'open' | 'resolved';
  created_at: string;
  resolved_at: string | null;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Geçersiz JSON.' }, { status: 400 });
  }

  const { subject, body: ticketBody } = (body ?? {}) as {
    subject?: unknown;
    body?: unknown;
  };

  if (
    typeof subject !== 'string' ||
    subject.trim().length < 3 ||
    subject.trim().length > 200
  ) {
    return NextResponse.json(
      { error: "'subject' 3-200 karakter arasında olmalı." },
      { status: 400 }
    );
  }
  if (
    typeof ticketBody !== 'string' ||
    ticketBody.trim().length < 10 ||
    ticketBody.trim().length > 2000
  ) {
    return NextResponse.json(
      { error: "'body' 10-2000 karakter arasında olmalı." },
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
  const { data, error } = await supabase
    .from('support_tickets')
    .insert({
      tenant_id: tenantId,
      project_id: projectId,
      subject: subject.trim(),
      body: ticketBody.trim(),
      status: 'open',
    })
    .select('id, subject, body, status, created_at, resolved_at')
    .single<TicketRow>();

  if (error || !data) {
    return NextResponse.json(
      { error: `Ticket kaydedilemedi: ${error?.message ?? 'bilinmiyor'}` },
      { status: 500 }
    );
  }

  // Email notification — başarısız olursa warn + devam et
  const ownerEmail = process.env.STUDIO_OWNER_EMAIL;
  let emailResult: { ok: boolean; reason?: string } = {
    ok: false,
    reason: 'STUDIO_OWNER_EMAIL yok',
  };
  if (ownerEmail) {
    const htmlBody = `
      <h2>Yeni destek talebi</h2>
      <p><strong>Proje ID:</strong> ${escapeHtml(projectId)}</p>
      <p><strong>Konu:</strong> ${escapeHtml(data.subject)}</p>
      <div style="margin:16px 0;padding:12px;border-left:3px solid #ccc;background:#f9f9f9;white-space:pre-wrap">${escapeHtml(data.body)}</div>
      <p style="color:#666;font-size:12px">Ticket ID: ${escapeHtml(data.id)}</p>
      <p style="color:#666;font-size:12px">Oluşturulma: ${escapeHtml(data.created_at)}</p>
    `;
    emailResult = await sendEmail({
      to: ownerEmail,
      subject: `[Studio] Yeni destek talebi: ${data.subject}`,
      html: htmlBody,
      text: `Yeni destek talebi\n\nProje: ${projectId}\nKonu: ${data.subject}\n\n${data.body}\n\nTicket ID: ${data.id}`,
    });
    if (!emailResult.ok) {
      console.warn('[support-tickets] email atılamadı:', emailResult.reason);
    }
  }

  return NextResponse.json(
    {
      ok: true,
      ticket: data,
      emailSent: emailResult.ok,
      emailError: emailResult.ok ? null : emailResult.reason ?? null,
    },
    { status: 201 }
  );
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const statusParam = url.searchParams.get('status') ?? 'all';
  const limitRaw = Number(url.searchParams.get('limit') ?? '50');
  const limit = Number.isFinite(limitRaw) ? Math.min(Math.max(limitRaw, 1), 200) : 50;

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
  let query = supabase
    .from('support_tickets')
    .select('id, subject, body, status, created_at, resolved_at')
    .eq('tenant_id', tenantId)
    .eq('project_id', projectId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (statusParam === 'open' || statusParam === 'resolved') {
    query = query.eq('status', statusParam);
  }

  const { data, error } = await query;
  if (error) {
    return NextResponse.json(
      { error: `Liste okunamadı: ${error.message}` },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { tickets: (data ?? []) as TicketRow[] },
    { status: 200 }
  );
}
