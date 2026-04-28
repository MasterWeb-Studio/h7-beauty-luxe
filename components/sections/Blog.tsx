import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { BlogSection } from '../../lib/content-types';

export function Blog({ data }: { data: BlogSection }) {
  return (
    <section className="py-20 md:py-28">
      <div className="container-custom">
        <div className="max-w-2xl">
          <h2 className="text-3xl tracking-tight md:text-4xl">{data.headline}</h2>
          {data.description ? (
            <p className="mt-4 text-[var(--color-muted)]">{data.description}</p>
          ) : null}
        </div>

        <div className="mt-16 grid grid-cols-1 gap-10 md:grid-cols-3">
          {data.items.map((item, index) => {
            const Wrapper = item.href ? Link : 'article';
            const wrapperProps = item.href ? { href: item.href } : {};
            return (
              <Wrapper
                key={index}
                {...(wrapperProps as { href: string })}
                className="group flex flex-col border-t border-[var(--color-border)] pt-6"
              >
                {item.category || item.date ? (
                  <div className="mb-3 flex items-center gap-3 text-xs uppercase tracking-widest text-[var(--color-muted)]">
                    {item.category ? <span>{item.category}</span> : null}
                    {item.category && item.date ? <span aria-hidden>·</span> : null}
                    {item.date ? <time dateTime={item.date}>{item.date}</time> : null}
                  </div>
                ) : null}

                <h3 className="text-lg font-medium leading-snug text-[var(--color-foreground)]">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--color-muted)]">
                  {item.summary}
                </p>

                {item.href ? (
                  <span className="mt-6 inline-flex items-center gap-1 text-sm text-[var(--color-foreground)] transition-colors group-hover:text-[var(--color-accent)]">
                    Devamı
                    <ArrowUpRight
                      className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      strokeWidth={1.5}
                    />
                  </span>
                ) : null}
              </Wrapper>
            );
          })}
        </div>
      </div>
    </section>
  );
}
