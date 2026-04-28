import type { HeroContent } from './types';
import { HeroLeftAligned } from './HeroLeftAligned';
import { HeroCentered } from './HeroCentered';
import { HeroSplit } from './HeroSplit';
import { HeroFullbleed } from './HeroFullbleed';
import { HeroDisplayTypography } from './HeroDisplayTypography';

// Dispatcher — SectionRenderer bu bileşeni çağırır. variant tanımsız ya da
// bilinmeyen bir string ise sessizce HeroLeftAligned'a düşer (backward compat).
export function HeroRenderer({ content }: { content: HeroContent }) {
  switch (content.variant) {
    case 'centered':
      return <HeroCentered content={content} />;
    case 'split':
      return <HeroSplit content={content} />;
    case 'fullbleed':
      return <HeroFullbleed content={content} />;
    case 'display-typography':
      return <HeroDisplayTypography content={content} />;
    case 'left-aligned':
    default:
      return <HeroLeftAligned content={content} />;
  }
}
