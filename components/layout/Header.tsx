import Link from 'next/link';
import type { SiteMeta } from '../../lib/content-types';

export function Header({ meta }: { meta: SiteMeta }) {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[var(--color-background)]/80 backdrop-blur">
      <div className="container-custom flex h-16 items-center justify-between">
        <Link
          href="/"
          className="text-base font-semibold tracking-tight text-[var(--color-foreground)]"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {meta.companyName}
        </Link>

        <nav aria-label="Ana menü" className="hidden md:block">
          <ul className="flex items-center gap-8">
            {meta.navigation.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-foreground)]"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <details className="relative md:hidden">
          <summary
            className="flex h-10 w-10 cursor-pointer list-none items-center justify-center text-[var(--color-foreground)]"
            aria-label="Menüyü aç/kapat"
          >
            <span className="sr-only">Menü</span>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
              <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </summary>
          <nav
            aria-label="Ana menü (mobil)"
            className="absolute right-0 top-full mt-2 min-w-[12rem] border border-[var(--color-border)] bg-[var(--color-background)] p-2 shadow-lg"
            style={{ borderRadius: 'var(--radius)' }}
          >
            <ul className="flex flex-col">
              {meta.navigation.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="block px-3 py-2 text-sm text-[var(--color-foreground)] hover:bg-[var(--color-foreground)]/5"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </details>
      </div>
    </header>
  );
}
