import { getAdminSupabase } from '@/lib/supabase-admin';

// Sprint 24 G3 — gerçek Supabase implementasyonu.
const PROJECT_ID = process.env.NEXT_PUBLIC_PROJECT_ID;
// ─── Newsletter Module Queries ────────────────────────────────────────────────
// NOTE: This module is subscriber-facing (write-only from public side).
// There is no public list or detail page — hasDetailPage: false.
// The actual POST handler lives at app/api/newsletter/route.ts.
// This file exposes the subscribe action used by server actions / API routes.

import type { NewsletterRow } from '@/lib/types/newsletter';

// ─── Subscribe ───────────────────────────────────────────────────────────────

export interface SubscribePayload {
  email: string;
  locale?: string;
  source?: string;
  projectId: string;
  tenantId: string;
}

export interface SubscribeResult {
  success: boolean;
  alreadySubscribed?: boolean;
  error?: string;
}

/**
 * Server-side subscribe helper.
 * Called from /api/newsletter POST route or a Server Action.
 * Inserts into module_newsletter; unique constraint on (project_id, email)
 * prevents duplicates — catch the error and return alreadySubscribed: true.
 */
export async function subscribeNewsletter(
  payload: SubscribePayload
): Promise<SubscribeResult> {
  // Scaffolder will inject the real Supabase/DB client here.
  // Placeholder implementation:
  void payload;
  throw new Error(
    'subscribeNewsletter: not implemented — scaffolder must inject DB client'
  );
}

// ─── Admin helpers (used by admin panel, not public site) ────────────────────

export interface FetchSubscribersOptions {
  projectId: string;
  tenantId: string;
  locale?: string;
  confirmed?: boolean;
  page?: number;
  pageSize?: number;
}

/**
 * Fetch paginated subscriber list for admin panel.
 */
export async function fetchNewsletterSubscribers(
  options: FetchSubscribersOptions
): Promise<{ items: NewsletterRow[]; total: number }> {
  void options;
  throw new Error(
    'fetchNewsletterSubscribers: not implemented — scaffolder must inject DB client'
  );
}

/**
 * Confirm subscriber(s) — bulk action.
 */
export async function confirmNewsletterSubscribers(
  ids: string[],
  projectId: string
): Promise<void> {
  void ids;
  void projectId;
  throw new Error(
    'confirmNewsletterSubscribers: not implemented — scaffolder must inject DB client'
  );
}

/**
 * Delete subscriber(s) — bulk action.
 */
export async function deleteNewsletterSubscribers(
  ids: string[],
  projectId: string
): Promise<void> {
  void ids;
  void projectId;
  throw new Error(
    'deleteNewsletterSubscribers: not implemented — scaffolder must inject DB client'
  );
}
