import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { LeadSubmitSchema } from '../../../lib/crm-schemas';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// TODO: Rate limiting — 3 req/dakika/IP.
// Örnek: @upstash/ratelimit (Upstash Redis) veya basit bir in-memory sayaç.
// Prod'a çıkmadan önce açılmalı; form spam koruması için.

export async function POST(request: Request) {
  // 1. Payload parse
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ error: 'Geçersiz JSON.' }, { status: 400 });
  }

  // 2. Validation
  const parsed = LeadSubmitSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: 'Lütfen tüm alanları doğru doldurun.',
        issues: parsed.error.issues.map((i) => ({
          path: i.path.join('.'),
          message: i.message,
        })),
      },
      { status: 400 }
    );
  }

  // 3. Env kontrolleri
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const tenantId = process.env.NEXT_PUBLIC_TENANT_ID;
  const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

  if (!supabaseUrl || !supabaseAnonKey || !tenantId) {
    console.error('[lead] eksik env: NEXT_PUBLIC_SUPABASE_URL/ANON_KEY/TENANT_ID');
    return NextResponse.json(
      { error: 'Form şu an alınamıyor. Lütfen daha sonra tekrar deneyin.' },
      { status: 500 }
    );
  }

  // 4. Insert
  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false },
    });

    const { error } = await supabase.from('crm_leads').insert({
      tenant_id: tenantId,
      project_id: projectId ?? null,
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone ?? null,
      message: parsed.data.message,
      source: 'contact-form',
      // status DB default: 'new'
    });

    if (error) {
      console.error('[lead] Supabase insert hatası:', error.message);
      return NextResponse.json(
        { error: 'Form kaydedilirken bir sorun oluştu.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error('[lead] beklenmeyen hata:', error);
    return NextResponse.json(
      { error: 'Form şu an alınamıyor.' },
      { status: 500 }
    );
  }
}
