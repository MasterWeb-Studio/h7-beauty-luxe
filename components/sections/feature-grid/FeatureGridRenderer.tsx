import type { FeatureGridContent } from './types';
import { FeatureGrid3Col } from './FeatureGrid3Col';
import { FeatureGrid2Col } from './FeatureGrid2Col';
import { FeatureGridList } from './FeatureGridList';
import { FeatureGridIconTop } from './FeatureGridIconTop';

// Dispatcher — SectionRenderer bu bileşeni çağırır. variant tanımsız ya da
// bilinmeyen bir string ise sessizce FeatureGrid3Col'e düşer (backward compat).
export function FeatureGridRenderer({ content }: { content: FeatureGridContent }) {
  switch (content.variant) {
    case 'two-col':
      return <FeatureGrid2Col content={content} />;
    case 'list':
      return <FeatureGridList content={content} />;
    case 'icon-top':
      return <FeatureGridIconTop content={content} />;
    case 'three-col':
    default:
      return <FeatureGrid3Col content={content} />;
  }
}
