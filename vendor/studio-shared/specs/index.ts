// ---------------------------------------------------------------------------
// H6 Faz 0 Gün 2 — Module Specs barrel
//
// Tek nokta: `import { ALL_MODULE_SPECS, getSpecById } from '@studio/shared'`.
// Agent'lar (Schema Architect, Admin UI Builder, vb.) ve validator bu
// listeden okur.
// ---------------------------------------------------------------------------

import type { ModuleSpec } from './module-spec-types.js';
import { productsSpec } from './modules/products.spec.js';
import { projectsSpec } from './modules/projects.spec.js';
import { newsSpec } from './modules/news.spec.js';
import { teamSpec } from './modules/team.spec.js';
import { referencesSpec } from './modules/references.spec.js';
import { certificatesSpec } from './modules/certificates.spec.js';
import { gallerySpec } from './modules/gallery.spec.js';
import { careerSpec } from './modules/career.spec.js';
import { servicesSpec } from './modules/services.spec.js';
import { counterSpec } from './modules/counter.spec.js';
import { newsletterSpec } from './modules/newsletter.spec.js';
import { timelineSpec } from './modules/timeline.spec.js';
import { videoSpec } from './modules/video.spec.js';
import { contactCardsSpec } from './modules/contact-cards.spec.js';

export const ALL_MODULE_SPECS: readonly ModuleSpec[] = [
  productsSpec,
  projectsSpec,
  newsSpec,
  teamSpec,
  referencesSpec,
  certificatesSpec,
  gallerySpec,
  careerSpec,
  servicesSpec,
  counterSpec,
  newsletterSpec,
  timelineSpec,
  videoSpec,
  contactCardsSpec,
  // Sprint 9+: audit + sonraki modüller
] as const;

export function getSpecById(id: string): ModuleSpec | undefined {
  return ALL_MODULE_SPECS.find((s) => s.meta.id === id);
}

export function listSpecIds(): string[] {
  return ALL_MODULE_SPECS.map((s) => s.meta.id);
}

// Re-exports
export * from './module-spec-types.js';
export { productsSpec } from './modules/products.spec.js';
export { projectsSpec } from './modules/projects.spec.js';
export { newsSpec } from './modules/news.spec.js';
export { teamSpec } from './modules/team.spec.js';
export { referencesSpec } from './modules/references.spec.js';
export { certificatesSpec } from './modules/certificates.spec.js';
export { gallerySpec } from './modules/gallery.spec.js';
export { careerSpec } from './modules/career.spec.js';
export { servicesSpec } from './modules/services.spec.js';
export { counterSpec } from './modules/counter.spec.js';
export { newsletterSpec } from './modules/newsletter.spec.js';
export { timelineSpec } from './modules/timeline.spec.js';
export { videoSpec } from './modules/video.spec.js';
export { contactCardsSpec } from './modules/contact-cards.spec.js';
