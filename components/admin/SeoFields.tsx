'use client';

import { useMemo } from 'react';
import { LocaleField } from './LocaleField';
import { LocaleTextArea } from './LocaleTextArea';
import { LocaleSlug } from './LocaleSlug';
import { MediaPicker, type MediaItem } from './MediaPicker';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/cn';

// ---------------------------------------------------------------------------
// H6 Sprint 1 Gün 6 — SeoFields (composite)
// Spec: docs/h6-reusable-components.md §11.
// ---------------------------------------------------------------------------

export interface SeoFieldsValue {
  title: Record<string, string>;
  description: Record<string, string>;
  slug: Record<string, string>;
  ogImage?: string | null;
  canonicalUrl?: string;
  noindex?: boolean;
}

interface SeoFieldsProps {
  value: SeoFieldsValue;
  onChange: (value: SeoFieldsValue) => void;
  locales: string[];
  activeLocale: string;
  onActiveLocaleChange: (locale: string) => void;
  autoGenerateFrom?: {
    title?: Record<string, string>;
    description?: Record<string, string>;
  };
  projectId: string;
  /** MediaPicker için (opsiyonel — runtime'da Supabase bridge) */
  fetchMedia?: React.ComponentProps<typeof MediaPicker>['fetchMedia'];
  onUpload?: React.ComponentProps<typeof MediaPicker>['onUpload'];
  initialMediaItems?: MediaItem[];
  /** SERP host preview için */
  siteUrl?: string;
}

const TITLE_MAX = 60;
const DESC_MAX = 160;

export function SeoFields({
  value,
  onChange,
  locales,
  activeLocale,
  onActiveLocaleChange,
  autoGenerateFrom,
  projectId,
  fetchMedia,
  onUpload,
  initialMediaItems,
  siteUrl = 'https://example.com',
}: SeoFieldsProps) {
  const patch = (next: Partial<SeoFieldsValue>) => onChange({ ...value, ...next });

  const titleForGen = useMemo(() => {
    const out: Record<string, string> = {};
    locales.forEach((l) => {
      out[l] = value.title[l] || autoGenerateFrom?.title?.[l] || '';
    });
    return out;
  }, [autoGenerateFrom, value.title, locales]);

  const serpTitle =
    value.title[activeLocale] ||
    autoGenerateFrom?.title?.[activeLocale] ||
    '(başlık yok)';
  const serpDesc =
    value.description[activeLocale] ||
    autoGenerateFrom?.description?.[activeLocale] ||
    '(açıklama yok)';
  const serpSlug = value.slug[activeLocale] || '';

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr,320px]">
      <div className="space-y-5">
        <LocaleField
          value={value.title}
          onChange={(v) => patch({ title: v })}
          locales={locales}
          activeLocale={activeLocale}
          onActiveLocaleChange={onActiveLocaleChange}
          label={{ tr: 'SEO Başlık', en: 'SEO Title' }}
          maxLength={TITLE_MAX}
          placeholder={{
            tr: autoGenerateFrom?.title?.[activeLocale] ?? '',
            en: autoGenerateFrom?.title?.[activeLocale] ?? '',
          }}
        />

        <LocaleTextArea
          value={value.description}
          onChange={(v) => patch({ description: v })}
          locales={locales}
          activeLocale={activeLocale}
          onActiveLocaleChange={onActiveLocaleChange}
          label={{ tr: 'SEO Açıklama', en: 'SEO Description' }}
          maxLength={DESC_MAX}
          rows={3}
          placeholder={{
            tr: autoGenerateFrom?.description?.[activeLocale] ?? '',
            en: autoGenerateFrom?.description?.[activeLocale] ?? '',
          }}
        />

        <LocaleSlug
          value={value.slug}
          onChange={(v) => patch({ slug: v })}
          locales={locales}
          activeLocale={activeLocale}
          onActiveLocaleChange={onActiveLocaleChange}
          label={{ tr: 'URL Slug', en: 'URL Slug' }}
          sourceField={titleForGen}
        />

        <div className="space-y-2">
          <Label>OG Image</Label>
          <MediaPicker
            projectId={projectId}
            value={value.ogImage ?? null}
            onChange={(v) => patch({ ogImage: v })}
            fetchMedia={fetchMedia}
            onUpload={onUpload}
            initialItems={initialMediaItems}
            categoryFilter="og"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="canonical">Canonical URL (opsiyonel)</Label>
          <Input
            id="canonical"
            type="url"
            value={value.canonicalUrl ?? ''}
            onChange={(e) => patch({ canonicalUrl: e.target.value })}
            placeholder={`${siteUrl}/...`}
          />
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={!!value.noindex}
            onChange={(e) => patch({ noindex: e.target.checked })}
            className="h-4 w-4 rounded border-slate-300"
          />
          <span>Arama motorlarından gizle (noindex)</span>
        </label>
      </div>

      <aside
        aria-label="Google arama önizleme"
        className="h-fit rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
      >
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Google önizleme
        </p>
        <div className="mt-3 space-y-1">
          <p className="truncate text-xs text-slate-600">
            {siteUrl}
            {serpSlug ? `/${serpSlug}` : ''}
          </p>
          <p
            className={cn(
              'line-clamp-2 text-base font-medium text-blue-700 underline-offset-2 hover:underline'
            )}
          >
            {truncateAtSentence(serpTitle, TITLE_MAX)}
          </p>
          <p className="line-clamp-3 text-sm text-slate-600">
            {truncateAtSentence(serpDesc, DESC_MAX)}
          </p>
          {value.noindex ? (
            <p className="mt-2 text-xs text-rose-600">🚫 noindex aktif</p>
          ) : null}
        </div>
      </aside>
    </div>
  );
}

/**
 * Cümle sınırına saygılı truncate — yarım kelime kesmez, sondaki "..."
 * spec §11.10 yaygın hata.
 */
function truncateAtSentence(input: string, max: number): string {
  if (!input || input.length <= max) return input;
  const cut = input.slice(0, max);
  const lastSentenceEnd = Math.max(
    cut.lastIndexOf('.'),
    cut.lastIndexOf('!'),
    cut.lastIndexOf('?')
  );
  if (lastSentenceEnd > max * 0.5) {
    return cut.slice(0, lastSentenceEnd + 1);
  }
  const lastSpace = cut.lastIndexOf(' ');
  if (lastSpace > 0) return cut.slice(0, lastSpace) + '…';
  return cut + '…';
}
