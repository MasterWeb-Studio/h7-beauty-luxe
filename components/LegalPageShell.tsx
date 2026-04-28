import type { ReactNode } from 'react';

export function LegalPageShell({
  title,
  lastUpdated,
  children,
}: {
  title: string;
  lastUpdated: string;
  children: ReactNode;
}) {
  return (
    <article className="py-16 md:py-24">
      <div className="container-custom">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl tracking-tight md:text-4xl">{title}</h1>
          <p className="mt-3 text-sm text-[var(--color-muted)]">
            {lastUpdated}
          </p>

          <div
            className="
              mt-10 space-y-5 text-[var(--color-muted)] leading-relaxed
              [&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:text-xl
              [&_h2]:font-medium [&_h2]:text-[var(--color-foreground)]
              [&_h2]:tracking-tight
              [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1
              [&_p]:text-base
            "
          >
            {children}
          </div>
        </div>
      </div>
    </article>
  );
}
