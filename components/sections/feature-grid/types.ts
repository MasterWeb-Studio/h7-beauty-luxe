// H5 Ayak B — Feature-grid varyant ortak prop tipi.
// Hero'daki pattern: section schema'sı tek kaynak; varyant dosyaları alias
// üzerinden çalışır. Ortogonal — scaffolder / Content Architect hâlâ
// FeatureGridSection yazıyor.
import type {
  FeatureGridSection,
  FeatureGridVariant,
} from '../../../lib/content-types';

export type FeatureGridContent = FeatureGridSection;
export type { FeatureGridVariant };
