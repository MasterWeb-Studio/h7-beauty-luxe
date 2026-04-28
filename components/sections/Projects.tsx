import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { ProjectsSection } from '../../lib/content-types';

export function Projects({ data }: { data: ProjectsSection }) {
  return (
    <section className="py-20 md:py-28">
      <div className="container-custom">
        <div className="max-w-2xl">
          <h2 className="text-3xl tracking-tight md:text-4xl">{data.headline}</h2>
          {data.description ? (
            <p className="mt-4 text-[var(--color-muted)]">{data.description}</p>
          ) : null}
        </div>

        <div className="mt-16 grid grid-cols-1 gap-10 md:grid-cols-2">
          {data.items.map((item, index) => {
            const Wrapper = item.href ? Link : 'div';
            const wrapperProps = item.href ? { href: item.href } : {};
            return (
              <Wrapper
                key={index}
                {...(wrapperProps as { href: string })}
                className={`group flex flex-col ${item.href ? 'cursor-pointer' : ''}`}
              >
                <div
                  className="aspect-[4/3] w-full bg-[var(--color-foreground)]/5 transition-colors group-hover:bg-[var(--color-foreground)]/10"
                  style={{ borderRadius: 'var(--radius)' }}
                  aria-hidden
                />
                <div className="mt-5 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-medium text-[var(--color-foreground)]">
                      {item.title}
                    </h3>
                    {item.year ? (
                      <div className="mt-1 text-sm text-[var(--color-muted)]">{item.year}</div>
                    ) : null}
                  </div>
                  {item.href ? (
                    <ArrowUpRight
                      className="mt-1 h-5 w-5 shrink-0 text-[var(--color-muted)] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--color-foreground)]"
                      strokeWidth={1.5}
                    />
                  ) : null}
                </div>
                <p className="mt-3 text-sm leading-relaxed text-[var(--color-muted)]">
                  {item.description}
                </p>
                {item.tags && item.tags.length > 0 ? (
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <li
                        key={tag}
                        className="border border-[var(--color-border)] px-3 py-1 text-xs text-[var(--color-muted)]"
                        style={{ borderRadius: 'var(--radius)' }}
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </Wrapper>
            );
          })}
        </div>
      </div>
    </section>
  );
}
