import type { ServicesContent } from './types';
import { ServicesCards } from './ServicesCards';
import { ServicesAccordion } from './ServicesAccordion';
import { ServicesTable } from './ServicesTable';

// Dispatcher — SectionRenderer bu bileşeni çağırır. variant tanımsız ya da
// bilinmeyen bir string ise sessizce ServicesCards'a düşer (Ayak B G3 pattern).
//
// NOT: H6 Sprint 5'te "services" modülü (ayrı DB entity) eklendi.
// Modül frontend bileşenleri `ServicesModuleRenderer.tsx` içinde
// (ServicesGrid / ServicesCard / ServicesDetail). Bu dosya ContentPlan
// services section'ı için dispatcher — karıştırma.
export function ServicesRenderer({ content }: { content: ServicesContent }) {
  switch (content.variant) {
    case 'accordion':
      return <ServicesAccordion content={content} />;
    case 'table':
      return <ServicesTable content={content} />;
    case 'cards':
    default:
      return <ServicesCards content={content} />;
  }
}
