import type { ModuleSpec } from '../module-spec-types.js';

// ---------------------------------------------------------------------------
// Projects (portfolio) module spec — H6 Sprint 1 pilot
//
// Yanıltıcı ad: "projects" burada **portfolio/iş/case-study** anlamında.
// Studio'nun kendi `projects` tablosu (tenant projeleri) ile isim
// çakışması var ama modül namespace'i farklı (module_projects).
//
// Ajans / mimar / yaratıcı stüdyolar için kritik. Client meta + showcase
// layout + 2 seviyeli kategori (sade).
// ---------------------------------------------------------------------------

export const projectsSpec: ModuleSpec = {
  meta: {
    id: 'projects',
    displayName: { tr: 'Projeler', en: 'Projects' },
    description: {
      tr: 'Portfolio — tamamlanmış işler, müşteri referansları, case study',
      en: 'Portfolio — completed work, client references, case studies',
    },
    icon: 'Briefcase',
    priority: 'critical',
    hasDetailPage: true,
    hasHomeSection: true,
    version: '1.0.0',
    since: '2026-04-19',
  },

  database: {
    tableName: 'module_projects',
    indexes: [
      {
        name: 'idx_mproj_project_published',
        columns: ['project_id', 'published_at DESC NULLS LAST'],
        method: 'btree',
        unique: false,
      },
      {
        name: 'idx_mproj_category',
        columns: ['category_id'],
        method: 'btree',
        unique: false,
      },
      {
        name: 'idx_mproj_slug_gin',
        columns: ['slug'],
        method: 'gin',
        unique: false,
      },
      {
        name: 'idx_mproj_featured',
        columns: ['project_id', 'is_featured'],
        method: 'btree',
        unique: false,
        where: 'is_featured = true',
      },
    ],
    rlsPolicies: [
      {
        name: 'mproj_service_all',
        action: 'all',
        using: "auth.role() = 'service_role'",
      },
      {
        name: 'mproj_public_read',
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
      maxLength: 150,
      seoRelevant: true,
      indexForSearch: true,
      description: { tr: 'Proje Başlığı', en: 'Project Title' },
      adminOrder: 2,
    },
    {
      name: 'short_description',
      type: 'textarea',
      localeAware: true,
      required: false,
      maxLength: 300,
      seoRelevant: true,
      description: { tr: 'Özet', en: 'Summary' },
      adminOrder: 3,
    },
    {
      name: 'description',
      type: 'richtext',
      localeAware: true,
      required: false,
      description: { tr: 'Detaylı Anlatım', en: 'Detailed Description' },
      adminHelp: {
        tr: 'Case study metni — nasıl çözüldü, kullanılan yaklaşım.',
        en: 'Case study text — how it was solved, approach used.',
      },
      adminOrder: 4,
    },
    {
      name: 'client_name',
      type: 'text',
      localeAware: false,
      required: false,
      maxLength: 120,
      description: { tr: 'Müşteri / Firma Adı', en: 'Client / Company Name' },
      adminHelp: {
        tr: 'Marka adı genelde tüm dillerde aynı — locale-bağımsız.',
        en: 'Brand name typically same across languages.',
      },
      adminOrder: 5,
    },
    {
      name: 'client_logo',
      type: 'media_ref',
      localeAware: false,
      required: false,
      description: { tr: 'Müşteri Logosu', en: 'Client Logo' },
      adminOrder: 6,
    },
    {
      name: 'completion_date',
      type: 'date',
      localeAware: false,
      required: false,
      description: { tr: 'Tamamlanma Tarihi', en: 'Completion Date' },
      adminOrder: 7,
    },
    {
      name: 'project_url',
      type: 'url',
      localeAware: false,
      required: false,
      description: { tr: 'Proje Linki', en: 'Project URL' },
      adminHelp: {
        tr: 'Canlı site URL\'si (varsa).',
        en: 'Live site URL (if any).',
      },
      adminOrder: 8,
    },
    {
      name: 'tags',
      type: 'string_array',
      localeAware: true,
      required: false,
      description: { tr: 'Etiketler', en: 'Tags' },
      adminOrder: 9,
    },
    {
      name: 'category_id',
      type: 'category_ref',
      localeAware: false,
      required: false,
      description: { tr: 'Kategori', en: 'Category' },
      adminOrder: 10,
    },
    {
      name: 'cover_image',
      type: 'media_ref',
      localeAware: false,
      required: true,
      description: { tr: 'Kapak Görseli', en: 'Cover Image' },
      adminHelp: {
        tr: 'Liste görünümünde kart kapak olarak kullanılır.',
        en: 'Used as card cover in list view.',
      },
      adminOrder: 11,
    },
    {
      name: 'gallery_images',
      type: 'media_array',
      localeAware: false,
      required: false,
      description: { tr: 'Galeri', en: 'Gallery' },
      adminOrder: 12,
    },
    {
      name: 'is_featured',
      type: 'boolean',
      localeAware: false,
      required: false,
      default: false,
      description: { tr: 'Öne Çıkarılmış', en: 'Featured' },
      adminOrder: 13,
    },
    {
      name: 'published_at',
      type: 'datetime',
      localeAware: false,
      required: false,
      description: { tr: 'Yayın Tarihi', en: 'Published Date' },
      adminOrder: 14,
    },
  ],

  categories: {
    enabled: true,
    hierarchical: true,
    maxDepth: 2,
    required: false,
  },

  admin: {
    listView: {
      columns: [
        { field: 'title', sortable: true, displayLocale: 'current' },
        { field: 'client_name', sortable: true, displayLocale: 'current' },
        { field: 'category_id', sortable: false, displayLocale: 'current' },
        { field: 'completion_date', sortable: true, width: '130px', displayLocale: 'current' },
        { field: 'is_featured', sortable: true, width: '100px', displayLocale: 'current' },
        { field: 'published_at', sortable: true, width: '140px', displayLocale: 'current' },
      ],
      filters: [
        {
          field: 'category_id',
          type: 'category-tree',
          label: { tr: 'Kategori', en: 'Category' },
        },
        {
          field: 'is_featured',
          type: 'boolean',
          label: { tr: 'Öne Çıkarılmış', en: 'Featured' },
        },
        {
          field: 'completion_date',
          type: 'date-range',
          label: { tr: 'Tarih', en: 'Date' },
        },
      ],
      searchableFields: ['title', 'client_name', 'short_description'],
      defaultSort: { field: 'completion_date', direction: 'desc' },
      pageSize: 50,
      showLocaleBadges: true,
    },
    detailView: {
      tabs: [
        { id: 'content', label: { tr: 'İçerik', en: 'Content' }, order: 0 },
        { id: 'client', label: { tr: 'Müşteri', en: 'Client' }, order: 1 },
        { id: 'media', label: { tr: 'Medya', en: 'Media' }, order: 2 },
        { id: 'seo', label: { tr: 'SEO', en: 'SEO' }, order: 3 },
        { id: 'publish', label: { tr: 'Yayınla', en: 'Publish' }, order: 4 },
      ],
      fieldGroups: [
        {
          tabId: 'content',
          title: { tr: 'Proje Bilgileri', en: 'Project Info' },
          fields: ['slug', 'title', 'short_description', 'description', 'tags', 'category_id'],
          collapsed: false,
        },
        {
          tabId: 'client',
          title: { tr: 'Müşteri Detayları', en: 'Client Details' },
          fields: ['client_name', 'client_logo', 'completion_date', 'project_url'],
          collapsed: false,
        },
        {
          tabId: 'media',
          title: { tr: 'Görseller', en: 'Images' },
          fields: ['cover_image', 'gallery_images'],
          collapsed: false,
        },
        {
          tabId: 'publish',
          title: { tr: 'Yayın', en: 'Publishing' },
          fields: ['is_featured', 'published_at'],
          collapsed: false,
        },
      ],
      previewEnabled: true,
      autoSaveDraft: true,
      showCharCount: true,
    },
    bulkActions: [
      { id: 'publish', label: { tr: 'Yayınla', en: 'Publish' }, icon: 'CheckCircle' },
      { id: 'feature', label: { tr: 'Öne Çıkar', en: 'Feature' }, icon: 'Star' },
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
      layout: 'masonry',
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
          field: 'completion_date',
          direction: 'desc',
          label: { tr: 'En Yeni', en: 'Newest' },
        },
        {
          id: 'featured',
          field: 'is_featured',
          direction: 'desc',
          label: { tr: 'Öne Çıkanlar', en: 'Featured' },
        },
      ],
      emptyStateMessage: {
        tr: 'Henüz proje eklenmemiş.',
        en: 'No projects yet.',
      },
      showPagination: true,
    },
    detailPage: {
      layout: 'showcase',
      sections: [
        { id: 'hero_image', order: 0, required: true },
        { id: 'title', order: 1, required: true },
        { id: 'client_meta', order: 2, required: false },
        { id: 'short_description', order: 3, required: false },
        { id: 'description', order: 4, required: false },
        { id: 'gallery', order: 5, required: false },
        { id: 'tags', order: 6, required: false },
        { id: 'project_url_cta', order: 7, required: false },
        { id: 'related', order: 8, required: false },
      ],
      relatedModuleId: 'projects',
      relatedLogic: 'same-category',
      relatedCount: 3,
    },
    homeSections: [
      {
        variantId: 'project-grid-3col',
        displayName: {
          tr: 'Proje Grid (3 Sütun)',
          en: 'Project Grid (3 Cols)',
        },
        defaultCount: 6,
        selectionLogic: 'latest',
      },
      {
        variantId: 'project-masonry',
        displayName: {
          tr: 'Proje Masonry',
          en: 'Project Masonry',
        },
        defaultCount: 8,
        selectionLogic: 'featured',
      },
      {
        variantId: 'project-featured-large',
        displayName: {
          tr: 'Öne Çıkan Proje (Büyük)',
          en: 'Featured Project (Large)',
        },
        defaultCount: 1,
        selectionLogic: 'featured',
      },
    ],
    urlPattern: '/projects/[...slug]',
  },

  content: {
    architectRules: [
      {
        trigger: 'sector:agency',
        rule: {
          tr: 'Portfolio zengin olmalı: 6-12 proje, 2-4 kategori. Her projede client_name + cover_image zorunlu.',
          en: 'Portfolio should be rich: 6-12 projects, 2-4 categories. Each needs client_name + cover_image.',
        },
        priority: 9,
      },
      {
        trigger: 'sector:architecture',
        rule: {
          tr: 'Mimari projelerde completion_date + konum önemli; case study detaylı yazılmalı.',
          en: 'For architecture, completion_date + location matter; case study detailed.',
        },
        priority: 8,
      },
      {
        trigger: 'sector:law',
        rule: {
          tr: 'Hukuki hassasiyet: müvekkil adları anonim olabilir, yalnız sektör paylaşılır (ör. "Büyük ölçekli gıda firması").',
          en: 'Legal sensitivity: client names may be anonymized, sector only (e.g. "Large food company").',
        },
        priority: 10,
      },
      {
        trigger: 'always',
        rule: {
          tr: 'project_url ancak gerçek canlı sitesi varsa ekle — uydurma URL yok.',
          en: 'project_url only if live site actually exists — no fabricated URLs.',
        },
        priority: 10,
      },
    ],
    placeholderStrategy: 'auto',
    samplePatterns: [
      {
        sector: 'agency',
        count: 3,
        samples: [
          {
            title: { tr: 'Marka Kimliği Projesi', en: 'Brand Identity Project' },
            client_name: 'Müşteri Adı',
            short_description: {
              tr: 'Demo içerik — müşteri admin\'den güncellenecek',
              en: 'Demo content — to be updated via admin',
            },
          },
        ],
      },
    ],
  },

  seo: {
    schemaType: 'CreativeWork',
    canonicalPattern: '/projects/{category_path}/{slug}',
    sitemapIncluded: true,
    sitemapPriority: 0.7,
    sitemapChangefreq: 'monthly',
    defaultMetaTitle: '{title} — {client_name} | {siteName}',
    defaultMetaDescription: '{short_description}',
    hreflangEnabled: true,
  },

  validation: {
    required: {
      tr: ['slug', 'title', 'cover_image'],
      en: ['slug', 'title', 'cover_image'],
    },
    unique: [
      {
        field: 'slug',
        scope: 'per-project-per-locale',
      },
    ],
    businessRules: [
      {
        id: 'completion-date-not-future',
        expression: 'completion_date <= now()',
        errorMessage: {
          tr: 'Tamamlanma tarihi gelecekte olamaz',
          en: 'Completion date cannot be in the future',
        },
      },
    ],
  },
};
