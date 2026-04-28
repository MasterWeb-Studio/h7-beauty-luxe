import type { ProductsSection } from '../../lib/content-types';

export function Products({ data }: { data: ProductsSection }) {
  return (
    <section className="py-20 md:py-28">
      <div className="container-custom">
        <div className="max-w-2xl">
          <h2 className="text-3xl tracking-tight md:text-4xl">{data.headline}</h2>
          {data.description ? (
            <p className="mt-4 text-[var(--color-muted)]">{data.description}</p>
          ) : null}
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {data.items.map((item, index) => (
            <div
              key={index}
              className="flex flex-col border border-[var(--color-border)] p-8"
              style={{ borderRadius: 'var(--radius)' }}
            >
              <h3 className="text-lg font-medium text-[var(--color-foreground)]">{item.title}</h3>
              <p className="mt-3 grow text-sm leading-relaxed text-[var(--color-muted)]">
                {item.description}
              </p>

              {item.price || item.duration ? (
                <div className="mt-6 flex items-baseline justify-between border-t border-[var(--color-border)] pt-4">
                  {item.price ? (
                    <div className="text-base font-medium text-[var(--color-foreground)]">
                      {item.price}
                    </div>
                  ) : (
                    <span />
                  )}
                  {item.duration ? (
                    <div className="text-sm text-[var(--color-muted)]">{item.duration}</div>
                  ) : null}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
