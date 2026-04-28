import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { AppointmentSubmitSchema } from '../../../lib/crm-schemas';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// TODO: Rate limiting — 3 req/dakika/IP.
// Randevu formu daha spam-hassas; rate limit + (ileride) CAPTCHA önerilir.

export async function POST(request: Request) {
  // 1. Payload parse
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ error: 'Geçersiz JSON.' }, { status: 400 });
  }

  // 2. Validation
  const parsed = AppointmentSubmitSchema.safeParse(raw);
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
    console.error(
      '[appointment] eksik env: NEXT_PUBLIC_SUPABASE_URL/ANON_KEY/TENANT_ID'
    );
    return NextResponse.json(
      { error: 'Randevu şu an alınamıyor. Lütfen daha sonra tekrar deneyin.' },
      { status: 500 }
    );
  }

  // 4. Insert
  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false },
    });

    const { error } = await supabase.from('crm_appointments').insert({
      tenant_id: tenantId,
      project_id: projectId ?? null,
      name: parsed.data.name,
      email: parsed.data.email ?? null,
      phone: parsed.data.phone,
      service: parsed.data.service ?? null,
      preferred_date: parsed.data.preferredDate,
      preferred_time: parsed.data.preferredTime,
      notes: parsed.data.notes ?? null,
      // status DB default: 'requested'
    });

    if (error) {
      console.error('[appointment] Supabase insert hatası:', error.message);
      return NextResponse.json(
        { error: 'Randevu kaydedilirken bir sorun oluştu.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error('[appointment] beklenmeyen hata:', error);
    return NextResponse.json(
      { error: 'Randevu şu an alınamıyor.' },
      { status: 500 }
    );
  }
}
