'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/cn';
import { slugify, slugifyInput } from '@/lib/slugify';

// ---------------------------------------------------------------------------
// H6 Sprint 1 Gün 2 — LocaleSlug
//
// URL slug her locale için ayrı. Source field'dan auto-generate, manuel edit
// override, uniqueCheck (debounced 500ms).
// Spec: docs/h6-reusable-components.md §9.
// ---------------------------------------------------------------------------

export type LocaleSlugValue = Record<string, string>;

type UniqueStatus = 'idle' | 'checking' | 'valid' | 'invalid';

interface LocaleSlugProps {
  value: LocaleSlugValue;
  onChange: (value: LocaleSlugValue) => void;
  locales: string[];
  activeLocale: string;
  onActiveLocaleChange: (locale: string) => void;
  label: Record<string, string>;
  /** name/title alanı — auto-generate kaynağı */
  sourceField?: Record<string, string>;
  autoGenerate?: boolean;
  required?: boolean;
  /** (slug, locale) → Promise<true=unique> */
  uniqueCheck?: (slug: string, locale: string) => Promise<boolean>;
  maxLength?: number;
  error?: string;
  disabled?: boolean;
}

export function LocaleSlug({
  value,
  onChange,
  locales,
  activeLocale,
  onActiveLocaleChange,
  label,
  sourceField,
  autoGenerate = true,
  required = false,
  uniqueCheck,
  maxLength = 200,
  error,
  disabled,
}: LocaleSlugProps) {
  const inputId = useId();
  const errorId = `${inputId}-error`;
  const statusId = `${inputId}-status`;

  const defaultLocale = locales[0] ?? 'tr';
  const currentValue = value[activeLocale] ?? '';
  const currentLabel =
    label[activeLocale] ?? label[defaultLocale] ?? Object.values(label)[0] ?? '';

  const [manualEdit, setManualEdit] = useState<Record<string, boolean>>({});
  const [uniqueStatus, setUniqueStatus] = useState<Record<string, UniqueStatus>>({});
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastCheckedRef = useRef<Record<string, string>>({});

  useEffect(() => {
    if (!autoGenerate || !sourceField) return;
    const source = sourceField[activeLocale];
    if (!source || manualEdit[activeLocale]) return;
    const generated = slugify(source, maxLength);
    if (generated === currentValue) return;
    onChange({ ...value, [activeLocale]: generated });
    // unique state kuruyor, ancak effect scope'una almıyoruz — aşağıdaki useEffect halleder
  }, [sourceField?.[activeLocale], autoGenerate, manualEdit, activeLocale]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!uniqueCheck) return;
    const slug = currentValue;
    if (!slug) {
      setUniqueStatus((s) => ({ ...s, [activeLocale]: 'idle' }));
      return;
    }
    if (lastCheckedRef.current[activeLocale] === slug) return;
    setUniqueStatus((s) => ({ ...s, [activeLocale]: 'checking' }));
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const ok = await uniqueCheck(slug, activeLocale);
        lastCheckedRef.current[activeLocale] = slug;
        setUniqueStatus((s) => ({
          ...s,
          [activeLocale]: ok ? 'valid' : 'invalid',
        }));
      } catch {
        setUniqueStatus((s) => ({ ...s, [activeLocale]: 'idle' }));
      }
    }, 500);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [currentValue, activeLocale, uniqueCheck]);

  const handleChange = useCallback(
    (next: string) => {
      setManualEdit((m) => ({ ...m, [activeLocale]: true }));
      onChange({ ...value, [activeLocale]: slugifyInput(next, maxLength) });
    },
    [activeLocale, maxLength, onChange, value]
  );

  const handleRegenerate = useCallback(() => {
    if (!sourceField) return;
    const source = sourceField[activeLocale];
    if (!source) return;
    setManualEdit((m) => ({ ...m, [activeLocale]: false }));
    onChange({ ...value, [activeLocale]: slugify(source, maxLength) });
  }, [activeLocale, maxLength, onChange, sourceField, value]);

  const hasValue = (locale: string) => {
    const v = value[locale];
    return typeof v === 'string' && v.trim().length > 0;
  };

  const status = uniqueStatus[activeLocale] ?? 'idle';

  const describedBy = [
    error ? errorId : null,
    status !== 'idle' ? statusId : null,
  ]
    .filter(Boolean)
    .join(' ') || undefined;

  const canRegenerate =
    autoGenerate && !!sourceField && !!sourceField[activeLocale]?.trim();

  return (
    <div className="space-y-2">
      <Label htmlFor={inputId}>
        {currentLabel}
        {required ? (
          <span className="ml-1 text-rose-600" aria-hidden="true">
            *
          </span>
        ) : null}
      </Label>

      <Tabs value={activeLocale} onValueChange={onActiveLocaleChange}>
        <TabsList>
          {locales.map((locale) => {
            const filled = hasValue(locale);
            const needsFill = required && locale === defaultLocale && !filled;
            return (
              <TabsTrigger
                key={locale}
                value={locale}
                disabled={disabled}
                className="gap-1.5"
                aria-label={`${locale.toUpperCase()} — ${
                  filled ? 'dolu' : needsFill ? 'eksik (zorunlu)' : 'boş'
                }`}
              >
                <span>{locale.toUpperCase()}</span>
                {filled ? (
                  <span className="text-emerald-600" aria-hidden="true">
                    ✓
                  </span>
                ) : needsFill ? (
                  <span className="text-amber-600" aria-hidden="true">
                    ⚠
                  </span>
                ) : null}
              </TabsTrigger>
            );
          })}
        </TabsList>
      </Tabs>

      <div className="flex items-center gap-2">
        <Input
          id={inputId}
          value={currentValue}
          onChange={(e) => handleChange(e.target.value)}
          maxLength={maxLength}
          disabled={disabled}
          required={required && activeLocale === defaultLocale}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          aria-required={required && activeLocale === defaultLocale}
          className="font-mono"
        />
        <button
          type="button"
          onClick={handleRegenerate}
          disabled={disabled || !canRegenerate}
          aria-label="Slug'ı yeniden üret"
          className={cn(
            'shrink-0 rounded-md border border-slate-300 bg-white px-2 py-1 text-xs font-medium text-slate-700 shadow-sm transition-colors',
            'hover:bg-slate-50',
            'disabled:cursor-not-allowed disabled:opacity-50'
          )}
        >
          Yeniden üret
        </button>
      </div>

      <div className="flex items-center justify-between text-xs">
        <span
          id={statusId}
          role="status"
          aria-live="polite"
          className={cn(
            'text-slate-500',
            status === 'valid' && 'text-emerald-600',
            status === 'invalid' && 'text-rose-600',
            status === 'checking' && 'text-slate-400'
          )}
        >
          {status === 'checking' && '⏳ Kontrol ediliyor…'}
          {status === 'valid' && '✓ Kullanılabilir'}
          {status === 'invalid' && '✗ Bu slug alınmış'}
          {status === 'idle' && (manualEdit[activeLocale] ? 'Elle düzenlendi' : '')}
        </span>
        {error ? (
          <span id={errorId} role="alert" className="text-rose-600">
            {error}
          </span>
        ) : null}
      </div>
    </div>
  );
}
