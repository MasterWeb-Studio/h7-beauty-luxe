import * as Icons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { ReactElement } from 'react';

// lucide-react icon registry lookup. Geçersiz / boş isim → null (bileşen
// icon slot'unu render etmez). AI bilinmeyen icon dönerse graceful
// degradation — layout boş kalır, build kırılmaz.
export function renderLucideIcon(
  name: string | undefined,
  props: { className?: string; strokeWidth?: number } = {}
): ReactElement | null {
  if (!name) return null;
  const registry = Icons as unknown as Record<string, LucideIcon | undefined>;
  const Icon = registry[name];
  if (!Icon) return null;
  return <Icon className={props.className} strokeWidth={props.strokeWidth ?? 1.5} />;
}
