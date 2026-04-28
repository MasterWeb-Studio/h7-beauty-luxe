interface NewsCategory {
  id: string;
  slug: Record<string, string>;
  name: Record<string, string>;
}

interface NewsCategoryFilterProps {
  categories: NewsCategory[];
  locale: string;
  activeCategorySlug: string | null;
}

export function NewsCategoryFilter({ categories, locale, activeCategorySlug }: NewsCategoryFilterProps) {
  return (
    <nav
      className="mb-8 flex flex-wrap gap-2"
      aria-label={locale === 'tr' ? 'Kategori filtresi' : 'Category filter'}
    >
      <a
        href={`/${locale}/news`}
        className="px-4 py-2 text-sm transition-opacity hover:opacity-80"
        style={{
          borderRadius: 'var(--radius-card)',
          background: activeCategorySlug === null ? 'var(--color-primary)' : 'var(--color-bg-muted)',
          color: activeCategorySlug === null ? 'var(--color-primary-fg)' : 'var(--color-text)',
        }}
        aria-current={activeCategorySlug === null ? 'page' : undefined}
      >
        {locale === 'tr' ? 'Tumu' : 'All'}
      </a>
      {categories.map((cat) => {
        const catSlug = cat.slug?.[locale] ?? cat.slug?.tr ?? Object.values(cat.slug ?? {})[0] ?? '';
        const catName = cat.name?.[locale] ?? cat.name?.tr ?? Object.values(cat.name ?? {})[0] ?? '';
        const isActive = activeCategorySlug === catSlug;
        return (
          <a
            key={cat.id}
            href={`/${locale}/news/${catSlug}`}
            className="px-4 py-2 text-sm transition-opacity hover:opacity-80"
            style={{
              borderRadius: 'var(--radius-card)',
              background: isActive ? 'var(--color-primary)' : 'var(--color-bg-muted)',
              color: isActive ? 'var(--color-primary-fg)' : 'var(--color-text)',
            }}
            aria-current={isActive ? 'page' : undefined}
          >
            {catName}
          </a>
        );
      })}
    </nav>
  );
}
