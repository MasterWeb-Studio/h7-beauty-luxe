import type { TeamSection } from '../../lib/content-types';

export function Team({ data }: { data: TeamSection }) {
  const cols =
    data.items.length >= 4 ? 'md:grid-cols-2 lg:grid-cols-4' : 'md:grid-cols-2 lg:grid-cols-3';

  return (
    <section className="py-20 md:py-28">
      <div className="container-custom">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl tracking-tight md:text-4xl">{data.headline}</h2>
          {data.description ? (
            <p className="mt-4 text-[var(--color-muted)]">{data.description}</p>
          ) : null}
        </div>

        <div className={`mt-16 grid grid-cols-1 gap-10 ${cols}`}>
          {data.items.map((item, index) => (
            <figure key={index} className="flex flex-col">
              <div
                className="aspect-square w-full bg-[var(--color-foreground)]/5"
                style={{ borderRadius: 'var(--radius)' }}
                aria-hidden
              />
              <figcaption className="mt-5">
                <div className="text-base font-medium text-[var(--color-foreground)]">
                  {item.name}
                </div>
                <div className="mt-1 text-sm text-[var(--color-accent)]">{item.role}</div>
                {item.bio ? (
                  <p className="mt-3 text-sm leading-relaxed text-[var(--color-muted)]">
                    {item.bio}
                  </p>
                ) : null}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
