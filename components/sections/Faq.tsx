import type { FaqSection } from '../../lib/content-types';

export function Faq({ data }: { data: FaqSection }) {
  return (
    <section className="py-20 md:py-28">
      <div className="container-custom">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <h2 className="text-3xl tracking-tight md:text-4xl">{data.headline}</h2>
          </div>

          <div className="mt-12 divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
            {data.items.map((item, index) => (
              <details key={index} className="group py-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                  <span className="text-base font-medium text-[var(--color-foreground)] md:text-lg">
                    {item.question}
                  </span>
                  <span
                    className="flex h-6 w-6 shrink-0 items-center justify-center text-[var(--color-muted)] transition-transform group-open:rotate-45"
                    aria-hidden
                  >
                    +
                  </span>
                </summary>
                <div className="mt-4 text-[var(--color-muted)]">
                  <p className="leading-relaxed">{item.answer}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
