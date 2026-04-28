import { NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { validatePresetSelection } from '../../../../lib/preset-validation';
import { PRESET_CACHE_TAG } from '../../../../lib/preset-loader';
import {
  getAdminSupabase,
  getProjectId,
  getTenantId,
} from '../../../../lib/supabase-admin';

// ---------------------------------------------------------------------------
// H5 Ayak C Gün 1 — Admin "Tema" sekmesi preset update endpoint.
//
// Akış:
//   1. Body parse + validatePresetSelection (enum + compatibility matrix)
//   2. projects.preset_selection UPDATE (service role)
//   3. Vercel Deploy Hook POST — projects.vercel_deploy_hook'dan okunur
//   4. revalidateTag + revalidatePath — local ISR için anında etki
//   5. Response { ok, updatedAt, redeployTriggered }
//
// Middleware /api/admin/**'ü koruyor → bu route içinde explicit auth check yok.
// Invalid preset → 400 + violations listesi (UI alanları kırmızı gösterir).
// ---------------------------------------------------------------------------

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function PATCH(request: Request) {
  // 1. JSON parse
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Geçersiz JSON.' }, { status: 400 });
  }

  const presetInput = (body as { presetSelection?: unknown }).presetSelection ?? body;

  // 2. Validation (enum + compat matrix)
  const validation = validatePresetSelection(presetInput);
  if (!validation.valid) {
    return NextResponse.json(
      { ok: false, error: 'Preset doğrulaması başarısız.', violations: validation.violations },
      { status: 400 }
    );
  }
  const preset = validation.data;

  // 3. Tenant/project bağlamı
  let tenantId: string;
  let projectId: string | null;
  try {
    tenantId = getTenantId();
    projectId = getProjectId();
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : 'Tenant env eksik.' },
      { status: 500 }
    );
  }
  if (!projectId) {
    return NextResponse.json(
      { ok: false, error: 'NEXT_PUBLIC_PROJECT_ID env eksik.' },
      { status: 500 }
    );
  }

  // 4. DB update — preset_selection
  let deployHookUrl: string | null = null;
  try {
    const supabase = getAdminSupabase();
    const { data, error } = await supabase
      .from('projects')
      .update({ preset_selection: preset as unknown as Record<string, unknown> })
      .eq('id', projectId)
      .eq('tenant_id', tenantId)
      .select('vercel_deploy_hook')
      .maybeSingle();

    if (error) {
      return NextResponse.json(
        { ok: false, error: `DB update başarısız: ${error.message}` },
        { status: 500 }
      );
    }
    deployHookUrl = (data?.vercel_deploy_hook as string | null | undefined) ?? null;
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : 'Bilinmeyen hata.' },
      { status: 500 }
    );
  }

  // 5. Cache invalidation — lokal preview için hızlı propagation.
  revalidateTag(PRESET_CACHE_TAG);
  revalidatePath('/', 'layout');

  // 6. Vercel Deploy Hook — yeni build preset'i DB'den okuyacak.
  // Hook URL sensitive — asla client'a sızmamalı.
  let redeployTriggered = false;
  let redeployError: string | null = null;
  if (deployHookUrl) {
    try {
      const res = await fetch(deployHookUrl, { method: 'POST' });
      if (res.ok) {
        redeployTriggered = true;
      } else {
        redeployError = `Vercel deploy hook ${res.status}`;
      }
    } catch (err) {
      redeployError = err instanceof Error ? err.message : 'deploy hook hata';
    }
  } else {
    redeployError = 'vercel_deploy_hook tanımlı değil (eski build?)';
  }

  return NextResponse.json(
    {
      ok: true,
      updatedAt: new Date().toISOString(),
      preset,
      redeployTriggered,
      redeployError,
    },
    { status: 200 }
  );
}
