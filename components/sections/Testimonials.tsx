import type { TestimonialsSection } from '../../lib/content-types';

export function Testimonials({ data }: { data: TestimonialsSection }) {
  const gridCols =
    data.items.length >= 3 ? 'md:grid-cols-3' : data.items.length === 2 ? 'md:grid-cols-2' : '';

  return (
    <section className="py-20 md:py-28">
      <div className="container-custom">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl tracking-tight md:text-4xl">{data.headline}</h2>
        </div>

        <div className={`mt-16 grid grid-cols-1 gap-8 ${gridCols}`}>
          {data.items.map((item, index) => (
            <figure
              key={index}
              className="flex flex-col border border-[var(--color-border)] p-8"
              style={{ borderRadius: 'var(--radius)' }}
            >
              <blockquote className="grow">
                <p className="text-base leading-relaxed text-[var(--color-foreground)] md:text-lg">
                  “{item.quote}”
                </p>
              </blockquote>
              <figcaption className="mt-6 border-t border-[var(--color-border)] pt-4">
                <div className="text-sm font-medium text-[var(--color-foreground)]">
                  {item.author}
                </div>
                <div className="text-sm text-[var(--color-muted)]">{item.role}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
