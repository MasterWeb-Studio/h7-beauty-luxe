/**
 * Home section variant: contact-cards-inline
 * Ayak B dispatcher registers this via homeSections config.
 * Usage: <ContactCardsInlineSection locale="tr" items={items} />
 */
import type { ContactCardRow } from '@/lib/types/contact-cards';
import { ContactCardsInline } from './ContactCardsModuleRenderer';

interface Props {
  items: ContactCardRow[];
  locale: string;
  heading?: string;
}

export function ContactCardsInlineSection({ items, locale, heading }: Props) {
  return (
    <section
      style={{
        background: 'var(--color-bg-muted)',
        paddingBlock: 'var(--section-gap-y)',
        borderTop: '1px solid var(--color-border)',
        borderBottom: '1px solid var(--color-border)',
      }}
    >
      <div className="container mx-auto px-4">
        {heading ? (
          <h2
            className="mb-6 text-center text-2xl"
            style={{
              fontFamily: 'var(--font-display)',
              color: 'var(--color-text)',
            }}
          >
            {heading}
          </h2>
        ) : null}
        <ContactCardsInline items={items} locale={locale} />
      </div>
    </section>
  );
}
