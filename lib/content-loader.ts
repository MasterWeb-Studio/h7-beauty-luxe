import { cache } from 'react';
import { unstable_cache } from 'next/cache';
import type { ContentPlan } from './content-types';
import { content as staticContent } from './content';
import { getAdminSupabase, getProjectId, getTenantId } from './supabase-admin';

// ---------------------------------------------------------------------------
// Content runtime loader.
//
// Öncelik: Supabase project_content → static lib/content.ts fallback.
// İki cache katmanı:
//   - unstable_cache: cross-request (5 dk revalidate + tag-based invalidation)
//   - React.cache: per-request dedup (aynı render'da birden fazla çağrı)
//
// Admin save sonrası /api/admin/content revalidateTag(CONTENT_CACHE_TAG)
// çağırır → bir sonraki istek DB'den taze veri çeker.
// ---------------------------------------------------------------------------

export const CONTENT_CACHE_TAG = 'project-content';

async function fetchFromSupabase(): Promise<ContentPlan | null> {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return null;

  let tenantId: string;
  let projectId: string | null;
  try {
    tenantId = getTenantId();
    projectId = getProjectId();
  } catch {
    return null;
  }
  if (!projectId) return null;

  try {
    const supabase = getAdminSupabase();
    const { data, error } = await supabase
      .from('project_content')
      .select('content')
      .eq('tenant_id', tenantId)
      .eq('project_id', projectId)
      .maybeSingle();

    if (error || !data) return null;
    return data.content as ContentPlan;
  } catch {
    return null;
  }
}

const loadContent = unstable_cache(
  async (): Promise<ContentPlan> => {
    const fromDb = await fetchFromSupabase();
    return fromDb ?? staticContent;
  },
  ['project-content-load'],
  { tags: [CONTENT_CACHE_TAG], revalidate: 300 }
);

/** Server component'lerde kullan. Admin kaydederse bir sonraki istekte taze veri. */
export const getContent = cache(loadContent);
