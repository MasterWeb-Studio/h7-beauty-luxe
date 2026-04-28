import type { TeamRow } from '@/lib/types/team';

interface TeamCardProps {
  item: TeamRow;
  locale: string;
}

export function TeamCard({ item, locale }: TeamCardProps) {
  const name = item.name ?? '';
  const role = item.role?.[locale] ?? item.role?.tr ?? Object.values(item.role ?? {})[0] ?? '';
  const slug =
    item.slug?.[locale] ?? item.slug?.tr ?? Object.values(item.slug ?? {})[0] ?? '';

  return (
    <a
      href={`/${locale}/team/${slug}`}
      className="group block overflow-hidden transition-shadow hover:shadow-lg"
      style={{
        borderRadius: 'var(--radius-card)',
        background: 'var(--color-bg-muted)',
      }}
    >
      {/* Photo */}
      <div
        className="overflow-hidden"
        style={{
          aspectRatio: '3 / 4',
          background: 'var(--color-bg-subtle)',
        }}
      >
        {item.photo ? (
          <img
            src={item.photo}
            alt={name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.3s ease',
            }}
            className="group-hover:scale-105"
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center"
            style={{ color: 'var(--color-text-muted)' }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
            </svg>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <h3
          className="text-base"
          style={{
            fontFamily: 'var(--font-display)',
            color: 'var(--color-text)',
            fontWeight: 600,
          }}
        >
          {name}
        </h3>
        {role && (
          <p
            className="mt-1 text-sm"
            style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}
          >
            {role}
          </p>
        )}
      </div>
    </a>
  );
}
