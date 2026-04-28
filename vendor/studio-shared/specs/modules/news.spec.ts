import type { ModuleSpec } from '../module-spec-types.js';

// ---------------------------------------------------------------------------
// News module spec — H6 Sprint 1 pilot
//
// Blog / haber / duyuru — article layout, flat kategori, NewsArticle SEO
// schema. SaaS default 5. sayfası, hukuk ofisi sektörel yazı havuzu, vs.
// ---------------------------------------------------------------------------

export const newsSpec: ModuleSpec = {
  meta: {
    id: 'news',
    displayName: { tr: 'Haberler', en: 'News' },
    description: {
      tr: 'Blog / haber / duyuru — makale görünümü, kategori filtre, SEO zengin',
      en: 'Blog / news / announcements — article view, category filter, SEO rich',
    },
    icon: 'Newspaper',
    priority: 'high',
    hasDetailPage: true,
    hasHomeSection: true,
    version: '1.0.0',
    since: '2026-04-19',
  },

  database: {
    tableName: 'module_news',
    indexes: [
      {
        name: 'idx_news_project_published',
        columns: ['project_id', 'published_at DESC NULLS LAST'],
        method: 'btree',
        unique: false,
        description: 'Liste sort by newest',
      },
      {
        name: 'idx_news_category',
        columns: ['category_id'],
        method: 'btree',
        unique: false,
      },
      {
        name: 'idx_news_slug_gin',
        columns: ['slug'],
        method: 'gin',
        unique: false,
      },
    ],
    rlsPolicies: [
      {
        name: 'news_service_all',
        action: 'all',
        using: "auth.role() = 'service_role'",
      },
      {
        name: 'news_public_read',
        action: 'select',
        using: 'published_at IS NOT NULL AND published_at <= now()',
      },
    ],
    triggers: [],
  },

  fields: [
    {
      name: 'slug',
      type: 'slug',
      localeAware: true,
      required: true,
      unique: 'per-project-per-locale',
      maxLength: 200,
      description: { tr: 'URL slug', en: 'URL slug' },
      adminOrder: 1,
    },
    {
      name: 'title',
      type: 'text',
      localeAware: true,
      required: true,
      maxLength: 200,
      seoRelevant: true,
      indexForSearch: true,
      description: { tr: 'Başlık', en: 'Title' },
      adminOrder: 2,
    },
    {
      name: 'excerpt',
      type: 'textarea',
      localeAware: true,
      required: false,
      maxLength: 300,
      seoRelevant: true,
      description: { tr: 'Özet', en: 'Excerpt' },
      adminHelp: {
        tr: 'Liste ve SEO meta description\'da kullanılır. 1-2 cümle.',
        en: 'Used in list view and SEO meta description. 1-2 sentences.',
      },
      adminOrder: 3,
    },
    {
      name: 'content',
      type: 'richtext',
      localeAware: true,
      required: true,
      description: { tr: 'İçerik', en: 'Content' },
      adminHelp: {
        tr: 'Zengin metin — başlık, paragraf, liste, link, görsel embed.',
        en: 'Rich text — headings, paragraphs, lists, links, embeds.',
      },
      adminOrder: 4,
    },
    {
      name: 'author',
      type: 'text',
      localeAware: false,
      required: false,
      maxLength: 120,
      description: { tr: 'Yazar', en: 'Author' },
      adminHelp: {
        tr: 'Kişi adı — locale-bağımsız.',
        en: 'Person name — locale-independent.',
      },
      adminOrder: 5,
    },
    {
      name: 'category_id',
      type: 'category_ref',
      localeAware: false,
      required: false,
      description: { tr: 'Kategori', en: 'Category' },
      adminOrder: 6,
    },
    {
      name: 'tags',
      type: 'string_array',
      localeAware: true,
      required: false,
      description: { tr: 'Etiketler', en: 'Tags' },
      adminOrder: 7,
    },
    {
      name: 'hero_image',
      type: 'media_ref',
      localeAware: false,
      required: true,
      description: { tr: 'Kapak Görseli', en: 'Hero Image' },
      adminHelp: {
        tr: 'Makale başında + sosyal medya paylaşımında kullanılır.',
        en: 'Used at article top and for social sharing.',
      },
      adminOrder: 8,
    },
    {
      name: 'gallery',
      type: 'media_array',
      localeAware: false,
      required: false,
      description: { tr: 'Galeri', en: 'Gallery' },
      adminOrder: 9,
    },
    {
      name: 'published_at',
      type: 'datetime',
      localeAware: false,
      required: true,
      description: { tr: 'Yayın Tarihi', en: 'Published Date' },
      adminOrder: 10,
    },
  ],

  categories: {
    enabled: true,
    hierarchical: false,
    maxDepth: 1,
    required: false,
  },

  admin: {
    listView: {
      columns: [
        { field: 'title', sortable: true, displayLocale: 'current' },
        { field: 'author', sortable: true, width: '160px', displayLocale: 'current' },
        { field: 'category_id', sortable: false, width: '140px', displayLocale: 'current' },
        { field: 'published_at', sortable: true, width: '140px', displayLocale: 'current' },
      ],
      filters: [
        {
          field: 'category_id',
          type: 'category-tree',
          label: { tr: 'Kategori', en: 'Category' },
        },
        {
          field: 'author',
          type: 'text-search',
          label: { tr: 'Yazar', en: 'Author' },
        },
        {
          field: 'tags',
          type: 'text-search',
          label: { tr: 'Etiket', en: 'Tag' },
        },
        {
          field: 'published_at',
          type: 'date-range',
          label: { tr: 'Tarih', en: 'Date' },
        },
      ],
      searchableFields: ['title', 'excerpt', 'content'],
      defaultSort: { field: 'published_at', direction: 'desc' },
      pageSize: 50,
      showLocaleBadges: true,
    },
    detailView: {
      tabs: [
        { id: 'content', label: { tr: 'İçerik', en: 'Content' }, order: 0 },
        { id: 'meta', label: { tr: 'Yazar & Kategori', en: 'Author & Category' }, order: 1 },
        { id: 'media', label: { tr: 'Medya', en: 'Media' }, order: 2 },
        { id: 'seo', label: { tr: 'SEO', en: 'SEO' }, order: 3 },
        { id: 'publish', label: { tr: 'Yayınla', en: 'Publish' }, order: 4 },
      ],
      fieldGroups: [
        {
          tabId: 'content',
          title: { tr: 'Makale', en: 'Article' },
          fields: ['slug', 'title', 'excerpt', 'content'],
          collapsed: false,
        },
        {
          tabId: 'meta',
          title: { tr: 'Üstveri', en: 'Metadata' },
          fields: ['author', 'category_id', 'tags'],
          collapsed: false,
        },
        {
          tabId: 'media',
          title: { tr: 'Görseller', en: 'Images' },
          fields: ['hero_image', 'gallery'],
          collapsed: false,
        },
        {
          tabId: 'publish',
          title: { tr: 'Yayın', en: 'Publishing' },
          fields: ['published_at'],
          collapsed: false,
        },
      ],
      previewEnabled: true,
      autoSaveDraft: true,
      showCharCount: true,
    },
    bulkActions: [
      { id: 'publish', label: { tr: 'Yayınla', en: 'Publish' }, icon: 'CheckCircle' },
      { id: 'unpublish', label: { tr: 'Taslağa Al', en: 'Unpublish' }, icon: 'Archive' },
      {
        id: 'delete',
        label: { tr: 'Sil', en: 'Delete' },
        icon: 'Trash2',
        confirm: true,
        destructive: true,
      },
    ],
  },

  frontend: {
    listPage: {
      layout: 'list',
      itemsPerPage: 12,
      filters: [
        {
          field: 'category_id',
          type: 'category-tree',
          label: { tr: 'Kategori', en: 'Category' },
        },
        {
          field: 'tags',
          type: 'text-search',
          label: { tr: 'Etiket', en: 'Tag' },
        },
      ],
      sortOptions: [
        {
          id: 'newest',
          field: 'published_at',
          direction: 'desc',
          label: { tr: 'En Yeni', en: 'Newest' },
        },
        {
          id: 'oldest',
          field: 'published_at',
          direction: 'asc',
          label: { tr: 'En Eski', en: 'Oldest' },
        },
      ],
      emptyStateMessage: {
        tr: 'Henüz haber eklenmemiş.',
        en: 'No news yet.',
      },
      showPagination: true,
    },
    detailPage: {
      layout: 'article',
      sections: [
        { id: 'hero_image', order: 0, required: true },
        { id: 'title', order: 1, required: true },
        { id: 'meta_bar', order: 2, required: true },
        { id: 'excerpt', order: 3, required: false },
        { id: 'content', order: 4, required: true },
        { id: 'gallery', order: 5, required: false },
        { id: 'tags', order: 6, required: false },
        { id: 'share', order: 7, required: false },
        { id: 'related', order: 8, required: false },
      ],
      relatedModuleId: 'news',
      relatedLogic: 'same-category',
      relatedCount: 3,
    },
    homeSections: [
      {
        variantId: 'news-grid-3col',
        displayName: {
          tr: 'Haber Grid (3 Sütun)',
          en: 'News Grid (3 Cols)',
        },
        defaultCount: 3,
        selectionLogic: 'latest',
      },
      {
        variantId: 'news-list',
        displayName: {
          tr: 'Haber Listesi',
          en: 'News List',
        },
        defaultCount: 5,
        selectionLogic: 'latest',
      },
      {
        variantId: 'news-featured-large',
        displayName: {
          tr: 'Öne Çıkan Haber (Büyük)',
          en: 'Featured News (Large)',
        },
        defaultCount: 1,
        selectionLogic: 'featured',
      },
    ],
    urlPattern: '/news/[slug]',
  },

  content: {
    architectRules: [
      {
        trigger: 'sector:saas',
        rule: {
          tr: 'Blog içerikleri: dokümantasyon tarzı, "nasıl yapılır" rehberleri, müşteri hikayeleri. 3-5 örnek makale.',
          en: 'Blog content: documentation style, how-to guides, customer stories. 3-5 sample articles.',
        },
        priority: 8,
      },
      {
        trigger: 'sector:law',
        rule: {
          tr: 'Hukuki yazılar: mevzuat değişiklikleri, sektörel analizler. Yorum değil bilgi ağırlıklı.',
          en: 'Legal articles: regulation updates, sector analyses. Informative, not opinion-heavy.',
        },
        priority: 9,
      },
      {
        trigger: 'sector:beauty',
        rule: {
          tr: 'Blog ikincil — duyuru / kampanya / bakım rehberi olabilir. 2-3 örnek yeter.',
          en: 'Blog secondary — announcements / campaigns / care guides. 2-3 samples enough.',
        },
        priority: 6,
      },
      {
        trigger: 'always',
        rule: {
          tr: 'Rakamsal iddia yasağı — istatistikler brief\'te açıkça varsa kullan, yoksa nitel dil.',
          en: 'No numerical claims — use stats only if explicitly in brief, else qualitative.',
        },
        priority: 10,
      },
    ],
    placeholderStrategy: 'auto',
    samplePatterns: [
      {
        sector: 'saas',
        count: 3,
        samples: [
          {
            title: {
              tr: 'Örnek Makale Başlığı',
              en: 'Sample Article Title',
            },
            excerpt: {
              tr: 'Demo özet — müşteri panelden düzenleyecek.',
              en: 'Demo excerpt — to be edited by client via admin.',
            },
          },
        ],
      },
    ],
  },

  seo: {
    schemaType: 'NewsArticle',
    canonicalPattern: '/news/{slug}',
    sitemapIncluded: true,
    sitemapPriority: 0.6,
    sitemapChangefreq: 'daily',
    defaultMetaTitle: '{title} | {siteName}',
    defaultMetaDescription: '{excerpt}',
    hreflangEnabled: true,
  },

  validation: {
    required: {
      tr: ['slug', 'title', 'content', 'hero_image', 'published_at'],
      en: ['slug', 'title', 'content', 'hero_image', 'published_at'],
    },
    unique: [
      {
        field: 'slug',
        scope: 'per-project-per-locale',
      },
    ],
    businessRules: [],
  },
};
