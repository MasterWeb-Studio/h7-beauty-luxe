'use client';

import { useId } from 'react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/cn';

// ---------------------------------------------------------------------------
// H6 Sprint 1 Gün 1 — LocaleField (atomic reusable)
//
// Multi-language text input. Her locale için ayrı değer tutar, locale tabs
// üstte. Admin UI Builder agent'ı `localeAware: true` + `type: 'text'`
// alanlarda bu komponenti import etmek ZORUNDA (validator regex check).
//
// Spec: docs/h6-reusable-components.md §6.
// ---------------------------------------------------------------------------

export type LocaleValue = Record<string, string>;

interface LocaleFieldProps {
  /** Her locale için değer — `{ tr: 'Ad', en: 'Name' }` */
  value: LocaleValue;
  /** Tek field değişince tüm LocaleValue objesi update */
  onChange: (value: LocaleValue) => void;
  /** Aktif locale listesi (projects.supported_locales) — ilk eleman default_locale */
  locales: string[];
  /** Şu an görünen locale */
  activeLocale: string;
  /** Tab bar tıklanınca parent'a bildir */
  onActiveLocaleChange: (locale: string) => void;
  /** Label her locale için — en azından default_locale dolu olmalı */
  label: Record<string, string>;
  /** Default locale için zorunluluk — diğer locale'ler opsiyonel */
  required?: boolean;
  maxLength?: number;
  placeholder?: Record<string, string>;
  /** Parent'tan gelen validation error (Zod message) */
  error?: string;
  autoFocus?: boolean;
  disabled?: boolean;
}

export function LocaleField({
  value,
  onChange,
  locales,
  activeLocale,
  onActiveLocaleChange,
  label,
  required = false,
  maxLength,
  placeholder,
  error,
  autoFocus,
  disabled,
}: LocaleFieldProps) {
  const inputId = useId();
  const errorId = `${inputId}-error`;
  const counterId = `${inputId}-counter`;

  const defaultLocale = locales[0] ?? 'tr';
  const currentValue = value[activeLocale] ?? '';
  const currentPlaceholder = placeholder?.[activeLocale] ?? '';
  const currentLabel =
    label[activeLocale] ?? label[defaultLocale] ?? Object.values(label)[0] ?? '';

  const hasValue = (locale: string) => {
    const v = value[locale];
    return typeof v === 'string' && v.trim().length > 0;
  };

  const describedBy = [
    error ? errorId : null,
    maxLength ? counterId : null,
  ]
    .filter(Boolean)
    .join(' ') || undefined;

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

      <Input
        id={inputId}
        value={currentValue}
        onChange={(e) =>
          onChange({ ...value, [activeLocale]: e.target.value })
        }
        placeholder={currentPlaceholder}
        maxLength={maxLength}
        autoFocus={autoFocus}
        disabled={disabled}
        required={required && activeLocale === defaultLocale}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        aria-required={required && activeLocale === defaultLocale}
      />

      {(error || maxLength) && (
        <div className="flex items-center justify-between text-xs">
          {error ? (
            <span id={errorId} role="alert" className="text-rose-600">
              {error}
            </span>
          ) : (
            <span />
          )}
          {maxLength ? (
            <span
              id={counterId}
              className={cn(
                'text-slate-500',
                currentValue.length >= maxLength * 0.9 && 'text-amber-600',
                currentValue.length >= maxLength && 'text-rose-600'
              )}
            >
              {currentValue.length}/{maxLength}
            </span>
          ) : null}
        </div>
      )}
    </div>
  );
}
