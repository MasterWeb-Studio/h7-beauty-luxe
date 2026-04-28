import type { CtaContent } from './types';
import { CtaBanner } from './CtaBanner';
import { CtaInline } from './CtaInline';
import { CtaSplitAction } from './CtaSplitAction';

export function CtaRenderer({ content }: { content: CtaContent }) {
  switch (content.variant) {
    case 'inline':
      return <CtaInline content={content} />;
    case 'split-action':
      return <CtaSplitAction content={content} />;
    case 'banner':
    default:
      return <CtaBanner content={content} />;
  }
}
