/**
 * CounterHomeSection
 *
 * Home page'de kullanılan async server component.
 * Variant dispatcher: variantId prop'una göre CounterSection'a yönlendirir.
 *
 * Kullanım (home page'de):
 *   <CounterHomeSection locale={locale} variantId="counter-4col" />
 *   <CounterHomeSection locale={locale} variantId="counter-inline" />
 */

import { fetchCounterList } from '@/lib/module-queries/counter';
import { CounterSection } from './CounterRenderer';

interface CounterHomeSectionProps {
  locale: string;
  variantId?: 'counter-4col' | 'counter-inline';
  title?: string;
  /** Override item count (default: variantId'e göre 4 veya 3) */
  limit?: number;
}

export async function CounterHomeSection({
  locale,
  variantId = 'counter-4col',
  title,
  limit,
}: CounterHomeSectionProps) {
  const defaultLimit = variantId === 'counter-inline' ? 3 : 4;
  const items = await fetchCounterList(locale, limit ?? defaultLimit);

  return (
    <CounterSection
      items={items}
      locale={locale}
      variantId={variantId}
      title={title}
    />
  );
}
