import type { StatsSection } from '../../lib/content-types';

export function Stats({ data }: { data: StatsSection }) {
  const cols =
    data.items.length >= 4 ? 'md:grid-cols-4' : data.items.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2';

  return (
    <section className="py-20 md:py-28">
      <div className="container-custom">
        <div className="mx-auto max-w-2xl text-center">
          {data.eyebrow ? (
            <p className="mb-4 text-sm font-medium uppercase tracking-widest text-[var(--color-accent)]">
              {data.eyebrow}
            </p>
          ) : null}
          <h2 className="text-3xl tracking-tight md:text-4xl">{data.headline}</h2>
          {data.description ? (
            <p className="mt-4 text-[var(--color-muted)]">{data.description}</p>
          ) : null}
        </div>

        <dl className={`mt-16 grid grid-cols-2 gap-10 ${cols}`}>
          {data.items.map((item, index) => (
            <div key={index} className="text-center">
              <dd className="text-4xl tracking-tight text-[var(--color-foreground)] md:text-5xl">
                {item.value}
              </dd>
              <dt className="mt-3 text-sm text-[var(--color-muted)]">{item.label}</dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
