// H6 Sprint 1 Gün 13 — Public Breadcrumb component.
import Link from 'next/link';
import type { BreadcrumbItem } from '@/lib/breadcrumb';

interface Props {
  items: BreadcrumbItem[];
  locale: string;
}

export function Breadcrumb({ items, locale: _locale }: Props) {
  if (items.length <= 1) return null;
  return (
    <nav aria-label="Breadcrumb" className="container mx-auto px-4 py-4">
      <ol className="flex flex-wrap items-center gap-1.5 text-xs" style={{ color: 'var(--color-text-muted, #64748b)' }}>
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={`${item.label}-${i}`} className="flex items-center gap-1.5">
              {i > 0 && <span aria-hidden="true">/</span>}
              {item.href && !isLast ? (
                <Link href={item.href} className="hover:underline">
                  {item.label}
                </Link>
              ) : (
                <span aria-current={isLast ? 'page' : undefined} style={isLast ? { color: 'var(--color-text)' } : undefined}>
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
