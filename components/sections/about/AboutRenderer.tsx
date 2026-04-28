import type { AboutContent } from './types';
import { AboutTextOnly } from './AboutTextOnly';
import { AboutWithImage } from './AboutWithImage';
import { AboutStatsSide } from './AboutStatsSide';

export function AboutRenderer({ content }: { content: AboutContent }) {
  switch (content.variant) {
    case 'with-image':
      return <AboutWithImage content={content} />;
    case 'stats-side':
      return <AboutStatsSide content={content} />;
    case 'text-only':
    default:
      return <AboutTextOnly content={content} />;
  }
}
