// ---------------------------------------------------------------------------
// H6 Sprint 12 Gün 4 — MediaPicker client helper
//
// MediaPicker Sprint 1 G5'te mock data ile kurulmuştu. Bu helper client-side
// çağrıları gerçek API'ya bağlar:
//   - fetchMedia → GET /api/admin/media
//   - onUpload   → POST /api/admin/media/upload (FormData)
//
// Client-only (use client) çünkü File objesi ve fetch browser context.
// ---------------------------------------------------------------------------

import type { MediaItem } from '@/components/admin/MediaPicker';

export interface FetchMediaFilter {
  projectId: string;
  category?: string;
  search?: string;
  unused?: boolean;
  moduleId?: string;
  page?: number;
  pageSize?: number;
}

export async function fetchMediaFromApi(filter: FetchMediaFilter): Promise<MediaItem[]> {
  const params = new URLSearchParams();
  if (filter.category) params.set('category', filter.category);
  if (filter.search) params.set('search', filter.search);
  if (filter.unused) params.set('unused', '1');
  if (filter.moduleId) params.set('moduleId', filter.moduleId);
  if (filter.page) params.set('page', String(filter.page));
  if (filter.pageSize) params.set('pageSize', String(filter.pageSize));

  const res = await fetch(`/api/admin/media?${params.toString()}`, {
    credentials: 'same-origin',
  });
  if (!res.ok) {
    throw new Error(`fetchMedia hata: ${res.status}`);
  }
  const data = await res.json();
  return (data.items ?? []) as MediaItem[];
}

export interface UploadMediaOptions {
  category?: string;
  altText?: string;
  moduleId?: string;
  recordId?: string;
}

export async function uploadMediaToApi(
  files: File[],
  options: UploadMediaOptions = {}
): Promise<MediaItem[]> {
  const results: MediaItem[] = [];
  // Paralel yerine sıralı yükleme — rate limit + kullanıcı progress'i net
  for (const file of files) {
    const form = new FormData();
    form.append('file', file);
    if (options.category) form.append('category', options.category);
    if (options.altText) form.append('altText', options.altText);
    if (options.moduleId) form.append('moduleId', options.moduleId);
    if (options.recordId) form.append('recordId', options.recordId);

    const res = await fetch('/api/admin/media/upload', {
      method: 'POST',
      body: form,
      credentials: 'same-origin',
    });
    if (!res.ok) {
      const detail = await res.json().catch(() => ({}));
      throw new Error(`Upload hata (${res.status}): ${detail.error ?? 'bilinmiyor'}`);
    }
    const data = await res.json();
    if (data.item) results.push(data.item as MediaItem);
  }
  return results;
}

/** ModuleDetail gibi bileşenlere hazır MediaPicker prop'ları. */
export function createMediaPickerProps(options: UploadMediaOptions = {}) {
  return {
    fetchMedia: (filter: FetchMediaFilter) => fetchMediaFromApi({ ...filter, ...options }),
    onUpload: (files: File[]) => uploadMediaToApi(files, options),
  };
}
