/**
 * Home section variant: contact-cards-3col
 * Ayak B dispatcher registers this via homeSections config.
 * Usage: <ContactCards3ColSection locale="tr" items={items} />
 */
import type { ContactCardRow } from '@/lib/types/contact-cards';
import { ContactCardsGrid } from './ContactCardsModuleRenderer';

interface Props {
  items: ContactCardRow[];
  locale: string;
  heading?: string;
  subheading?: string;
}

export function ContactCards3ColSection({ items, locale, heading, subheading }: Props) {
  const defaultHeading = locale === 'tr' ? 'İletişim' : 'Contact';

  return (
    <section
      style={{
        background: 'var(--color-bg)',
        paddingBlock: 'var(--section-gap-y)',
      }}
    >
      <div className="container mx-auto px-4">
        {(heading ?? defaultHeading) ? (
          <div className="mb-8 text-center">
            <h2
              className="text-3xl"
              style={{
                fontFamily: 'var(--font-display)',
                color: 'var(--color-text)',
              }}
            >
              {heading ?? defaultHeading}
            </h2>
            {subheading ? (
              <p
                className="mt-3 text-base"
                style={{ color: 'var(--color-text-muted)' }}
              >
                {subheading}
              </p>
            ) : null}
          </div>
        ) : null}
        <ContactCardsGrid items={items} locale={locale} />
      </div>
    </section>
  );
}
