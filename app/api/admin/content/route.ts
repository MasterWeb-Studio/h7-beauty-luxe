import { NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { ContentPlanSchema } from '../../../../lib/content-schemas';
import { CONTENT_CACHE_TAG } from '../../../../lib/content-loader';
import {
  getAdminSupabase,
  getProjectId,
  getTenantId,
} from '../../../../lib/supabase-admin';

// ---------------------------------------------------------------------------
// Content artık Supabase'den okunuyor (project_content tablosu).
// lib/content.ts sadece scaffolder-üretimli static fallback tutar; admin
// değişiklikleri DB'ye gider. revalidatePath tüm route'ları invalidate eder,
// site runtime'da yeni content'i content-loader üzerinden çeker.
// Deploy-ready: read-only FS'te çalışır (Vercel, vb.).
// ---------------------------------------------------------------------------

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Middleware /api/admin/**'ü koruyor → explicit auth check yok.

export async function POST(request: Request) {
  // 1. Parse
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ error: 'Geçersiz JSON.' }, { status: 400 });
  }

  // 2. Schema validation
  const parsed = ContentPlanSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: 'Schema doğrulaması başarısız.',
        issues: parsed.error.issues.map((i) => ({
          path: i.path.join('.'),
          message: i.message,
        })),
      },
      { status: 400 }
    );
  }

  // 3. Tenant/project bağlamı
  let tenantId: string;
  let projectId: string | null;
  try {
    tenantId = getTenantId();
    projectId = getProjectId();
  } catch (err) {
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : 'Tenant env eksik (NEXT_PUBLIC_TENANT_ID).',
      },
      { status: 500 }
    );
  }

  if (!projectId) {
    return NextResponse.json(
      {
        error:
          'NEXT_PUBLIC_PROJECT_ID env eksik — project_content kaydı için gerekli.',
      },
      { status: 500 }
    );
  }

  // 4. Upsert
  try {
    const supabase = getAdminSupabase();
    const { error } = await supabase.from('project_content').upsert(
      {
        tenant_id: tenantId,
        project_id: projectId,
        content: parsed.data as unknown as Record<string, unknown>,
        updated_by: 'admin',
      },
      { onConflict: 'tenant_id,project_id' }
    );

    if (error) {
      console.error('[admin/content] Supabase hatası:', error.message);
      return NextResponse.json(
        { error: `Kaydedilemedi: ${error.message}` },
        { status: 500 }
      );
    }
  } catch (err) {
    console.error('[admin/content] beklenmeyen:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Bilinmeyen hata.' },
      { status: 500 }
    );
  }

  // 5. Revalidate — unstable_cache tag + route cache
  revalidateTag(CONTENT_CACHE_TAG);
  revalidatePath('/', 'layout');

  return NextResponse.json(
    { ok: true, updatedAt: new Date().toISOString() },
    { status: 200 }
  );
}
