import type { Section } from './content-types';

// Section'ın items dizisinde _isPlaceholder: true item var mı?
// Admin content editor bu helper'la "örnek içerik" rozeti gösterir.
// Yalnızca fill section'ların items'ları _isPlaceholder taşır; Core'lar false döner.
export function hasPlaceholderItems(section: Section): boolean {
  const items = (section as { items?: unknown }).items;
  if (!Array.isArray(items)) return false;
  return items.some(
    (item) =>
      typeof item === 'object' &&
      item !== null &&
      '_isPlaceholder' in item &&
      (item as { _isPlaceholder?: unknown })._isPlaceholder === true
  );
}
