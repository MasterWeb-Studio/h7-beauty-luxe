'use client';

import { useEffect, useId, useRef } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/cn';

// ---------------------------------------------------------------------------
// H6 Sprint 1 Gün 2 — LocaleTextArea
//
// LocaleField pattern, <textarea> versiyonu. `rows` + `autoResize` opsiyonları.
// Spec: docs/h6-reusable-components.md §7.
// ---------------------------------------------------------------------------

export type LocaleTextAreaValue = Record<string, string>;

interface LocaleTextAreaProps {
  value: LocaleTextAreaValue;
  onChange: (value: LocaleTextAreaValue) => void;
  locales: string[];
  activeLocale: string;
  onActiveLocaleChange: (locale: string) => void;
  label: Record<string, string>;
  required?: boolean;
  maxLength?: number;
  placeholder?: Record<string, string>;
  error?: string;
  autoFocus?: boolean;
  disabled?: boolean;
  /** Satır sayısı (default 4) */
  rows?: number;
  /** Content'e göre dinamik yükseklik */
  autoResize?: boolean;
}

export function LocaleTextArea({
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
  rows = 4,
  autoResize = false,
}: LocaleTextAreaProps) {
  const inputId = useId();
  const errorId = `${inputId}-error`;
  const counterId = `${inputId}-counter`;
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

  useEffect(() => {
    if (!autoResize) return;
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, [currentValue, autoResize]);

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

      <Textarea
        ref={textareaRef}
        id={inputId}
        value={currentValue}
        onChange={(e) =>
          onChange({ ...value, [activeLocale]: e.target.value })
        }
        placeholder={currentPlaceholder}
        maxLength={maxLength}
        autoFocus={autoFocus}
        disabled={disabled}
        rows={rows}
        required={required && activeLocale === defaultLocale}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        aria-required={required && activeLocale === defaultLocale}
        style={autoResize ? { resize: 'none', overflow: 'hidden' } : undefined}
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
