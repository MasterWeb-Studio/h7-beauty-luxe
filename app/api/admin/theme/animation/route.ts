import { NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { ANIMATION_CACHE_TAG } from '../../../../../lib/preset-loader';
import {
  getAdminSupabase,
  getProjectId,
  getTenantId,
} from '../../../../../lib/supabase-admin';

// H6 Sprint 14 — Admin /theme animation preset update endpoint.
// PATCH /api/admin/theme/animation
// body: { preset: 'none' | 'subtle' | 'normal' | 'energetic' }

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const VALID_PRESETS = ['none', 'subtle', 'normal', 'energetic'] as const;

export async function PATCH(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Geçersiz JSON.' }, { status: 400 });
  }

  const preset = (body as { preset?: unknown })?.preset;
  if (typeof preset !== 'string' || !VALID_PRESETS.includes(preset as any)) {
    return NextResponse.json(
      {
        ok: false,
        error: 'preset alanı geçersiz',
        detail: `${VALID_PRESETS.join(' | ')} bekleniyor`,
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
      { ok: false, error: err instanceof Error ? err.message : 'Tenant env eksik' },
      { status: 500 }
    );
  }
  if (!projectId) {
    return NextResponse.json(
      { ok: false, error: 'NEXT_PUBLIC_PROJECT_ID env eksik' },
      { status: 500 }
    );
  }

  let deployHookUrl: string | null = null;
  try {
    const supabase = getAdminSupabase();
    const { data, error } = await supabase
      .from('projects')
      .update({ preset_animation: preset })
      .eq('id', projectId)
      .eq('tenant_id', tenantId)
      .select('vercel_deploy_hook')
      .maybeSingle();
    if (error) {
      return NextResponse.json(
        { ok: false, error: `DB update: ${error.message}` },
        { status: 500 }
      );
    }
    deployHookUrl = (data?.vercel_deploy_hook as string | null | undefined) ?? null;
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : 'DB hata' },
      { status: 500 }
    );
  }

  revalidateTag(ANIMATION_CACHE_TAG);
  revalidatePath('/', 'layout');

  let redeployTriggered = false;
  let redeployError: string | null = null;
  if (deployHookUrl) {
    try {
      const res = await fetch(deployHookUrl, { method: 'POST' });
      if (res.ok) redeployTriggered = true;
      else redeployError = `Deploy hook ${res.status}`;
    } catch (err) {
      redeployError = err instanceof Error ? err.message : 'deploy hook hata';
    }
  } else {
    redeployError = 'vercel_deploy_hook tanımlı değil';
  }

  return NextResponse.json(
    {
      ok: true,
      preset,
      updatedAt: new Date().toISOString(),
      redeployTriggered,
      redeployError,
    },
    { status: 200 }
  );
}
