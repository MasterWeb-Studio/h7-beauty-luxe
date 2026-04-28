// SADECE server-side. SUPABASE_SERVICE_ROLE_KEY client bundle'a SIZMAMALI.
// Next.js'in 'use client' veya browser entry'lerinde bu dosyayı import ETMEYİN.
// İhlal halinde Next.js build sırasında tespit etmez; manuel disiplin gerekli.

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let _client: SupabaseClient | null = null;

/**
 * Service-role yetkiyle Supabase client. RLS'i bypass eder.
 * Sadece server component'lerden ve route handler'lardan çağrılmalı.
 */
export function getAdminSupabase(): SupabaseClient {
  if (_client) return _client;

  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      'Supabase admin env eksik: SUPABASE_URL ve SUPABASE_SERVICE_ROLE_KEY gerekli.'
    );
  }

  _client = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return _client;
}

/** Bu projenin tenant_id'si — scaffolder .env.local'e yazıyor. */
export function getTenantId(): string {
  const id = process.env.NEXT_PUBLIC_TENANT_ID;
  if (!id) throw new Error('NEXT_PUBLIC_TENANT_ID env eksik.');
  return id;
}

/** Bu projenin project_id'si — scaffolder .env.local'e yazıyor. */
export function getProjectId(): string | null {
  const id = process.env.NEXT_PUBLIC_PROJECT_ID;
  return id && id.length > 0 ? id : null;
}

// H6 Sprint 1 Gün 13 — agent output uyumu için alias + composite helper
export const getSupabaseAdmin = getAdminSupabase;

export async function getProjectTenantIds(): Promise<{ tenantId: string; projectId: string }> {
  const tenantId = getTenantId();
  const projectId = getProjectId();
  if (!projectId) throw new Error('NEXT_PUBLIC_PROJECT_ID env eksik.');
  return { tenantId, projectId };
}
