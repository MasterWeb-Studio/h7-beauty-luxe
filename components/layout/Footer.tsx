import Link from 'next/link';
import type { SiteMeta } from '../../lib/content-types';

const socialLabels: Record<string, string> = {
  twitter: 'Twitter',
  linkedin: 'LinkedIn',
  instagram: 'Instagram',
  facebook: 'Facebook',
  github: 'GitHub',
  youtube: 'YouTube',
};

export function Footer({ meta }: { meta: SiteMeta }) {
  const { footer } = meta;

  return (
    <footer className="mt-24 border-t border-[var(--color-border)] py-16">
      <div className="container-custom">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <div
              className="text-base font-semibold tracking-tight"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {meta.companyName}
            </div>
            <p className="mt-4 max-w-sm text-sm text-[var(--color-muted)]">{footer.about}</p>

            {footer.social && footer.social.length > 0 ? (
              <ul className="mt-6 flex flex-wrap gap-4">
                {footer.social.map((item) => (
                  <li key={item.platform}>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-foreground)]"
                    >
                      {socialLabels[item.platform] ?? item.platform}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          {footer.columns.length > 0 ? (
            <div className="grid grid-cols-2 gap-8 md:col-span-7 md:grid-cols-3">
              {footer.columns.map((column) => (
                <div key={column.title}>
                  <div className="text-sm font-medium text-[var(--color-foreground)]">
                    {column.title}
                  </div>
                  <ul className="mt-4 space-y-3">
                    {column.links.map((link) => (
                      <li key={`${link.label}-${link.href}`}>
                        <Link
                          href={link.href}
                          className="text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-foreground)]"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div className="mt-16 border-t border-[var(--color-border)] pt-6 text-sm text-[var(--color-muted)]">
          {footer.copyright}
        </div>
      </div>
    </footer>
  );
}
