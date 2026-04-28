import type { TimelineRow } from '@/lib/types/timeline';
import { TimelineVertical, TimelineHorizontal } from './TimelineRenderer';

export type TimelineSectionVariant = 'timeline-vertical' | 'timeline-horizontal';

interface TimelineSectionProps {
  items: TimelineRow[];
  locale: string;
  variant?: TimelineSectionVariant;
  title?: string;
  subtitle?: string;
}

export function TimelineSection({
  items,
  locale,
  variant = 'timeline-vertical',
  title,
  subtitle,
}: TimelineSectionProps) {
  return (
    <section
      style={{
        background: 'var(--color-bg)',
        color: 'var(--color-text)',
        paddingBlock: 'var(--section-gap-y)',
      }}
    >
      <div className="container mx-auto px-4">
        {(title || subtitle) && (
          <div className="mb-10 text-center">
            {title && (
              <h2
                className="text-3xl"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}
              >
                {title}
              </h2>
            )}
            {subtitle && (
              <p
                className="mt-3 text-base"
                style={{ color: 'var(--color-text-muted)' }}
              >
                {subtitle}
              </p>
            )}
          </div>
        )}

        {variant === 'timeline-horizontal' ? (
          <TimelineHorizontal items={items} locale={locale} />
        ) : (
          <TimelineVertical items={items} locale={locale} />
        )}
      </div>
    </section>
  );
}
