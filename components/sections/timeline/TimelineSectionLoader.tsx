/**
 * TimelineSectionLoader — async RSC wrapper.
 * Used in home page / page builder to embed a timeline section variant.
 *
 * Usage:
 *   <TimelineSectionLoader
 *     locale="tr"
 *     variant="timeline-vertical"
 *     count={8}
 *     title="Tarihçemiz"
 *   />
 */
import { fetchTimelineForHome } from '@/lib/module-queries/timeline';
import { TimelineSection, type TimelineSectionVariant } from './TimelineSection';

interface TimelineSectionLoaderProps {
  locale: string;
  variant?: TimelineSectionVariant;
  count?: number;
  title?: string;
  subtitle?: string;
}

export async function TimelineSectionLoader({
  locale,
  variant = 'timeline-vertical',
  count = 8,
  title,
  subtitle,
}: TimelineSectionLoaderProps) {
  const items = await fetchTimelineForHome(locale, count);

  return (
    <TimelineSection
      items={items}
      locale={locale}
      variant={variant}
      title={title}
      subtitle={subtitle}
    />
  );
}
