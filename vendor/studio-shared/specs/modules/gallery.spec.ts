import type { ModuleSpec } from '../module-spec-types.js';

// ---------------------------------------------------------------------------
// Gallery module spec — H6 Sprint 4
//
// Görsel galeri — etkinlik fotoğrafları, portföy, ürün galerisi. Hiyerarşik
// kategori (max depth 2). Cover + çoklu gallery images. Public list
// masonry, detail showcase (lightbox). ImageGallery schema.org.
// ---------------------------------------------------------------------------

export const gallerySpec: ModuleSpec = {
  meta: {
    id: 'gallery',
    displayName: { tr: 'Galeri', en: 'Gallery' },
    description: {
      tr: 'Görsel galeri — etkinlik, portföy, ürün fotoğrafları',
      en: 'Image gallery — events, portfolio, product photos',
    },
    icon: 'Images',
    priority: 'medium',
    hasDetailPage: true,
    hasHomeSection: true,
    version: '1.0.0',
    since: '2026-04-20',
  },

  database: {
    tableName: 'module_gallery',
    indexes: [
      {
        name: 'idx_gallery_project_published',
        columns: ['project_id', 'published_at DESC NULLS LAST'],
        method: 'btree',
        unique: false,
        description: 'Liste sort by newest',
      },
      {
        name: 'idx_gallery_category',
        columns: ['category_id'],
        method: 'btree',
        unique: false,
      },
      {
        name: 'idx_gallery_slug_gin',
        columns: ['slug'],
        method: 'gin',
        unique: false,
      },
    ],
    rlsPolicies: [
      {
        name: 'gallery_service_all',
        action: 'all',
        using: "auth.role() = 'service_role'",
      },
      {
        name: 'gallery_public_read',
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
      description: { tr: 'Galeri Başlığı', en: 'Gallery Title' },
      adminOrder: 2,
    },
    {
      name: 'description',
      type: 'textarea',
      localeAware: true,
      required: false,
      maxLength: 500,
      seoRelevant: true,
      description: { tr: 'Açıklama', en: 'Description' },
      adminOrder: 3,
    },
    {
      name: 'category_id',
      type: 'category_ref',
      localeAware: false,
      required: false,
      description: { tr: 'Kategori', en: 'Category' },
      adminOrder: 4,
    },
    {
      name: 'cover_image',
      type: 'media_ref',
      localeAware: false,
      required: true,
      description: { tr: 'Kapak Görseli', en: 'Cover Image' },
      adminHelp: {
        tr: 'Liste sayfasında gösterilen kapak. Tercihen 16:9 veya 4:3.',
        en: 'Shown as cover in list page. Preferably 16:9 or 4:3.',
      },
      adminOrder: 5,
    },
    {
      name: 'images',
      type: 'media_array',
      localeAware: false,
      required: true,
      description: { tr: 'Galeri Görselleri', en: 'Gallery Images' },
      adminHelp: {
        tr: '3-30 arası görsel önerilir. Lightbox ile detay sayfasında açılır.',
        en: '3-30 images recommended. Opened via lightbox on detail page.',
      },
      adminOrder: 6,
    },
    {
      name: 'taken_at',
      type: 'date',
      localeAware: false,
      required: false,
      description: { tr: 'Çekim Tarihi', en: 'Taken Date' },
      adminHelp: {
        tr: 'Etkinlik/çekim tarihi — opsiyonel.',
        en: 'Event / shoot date — optional.',
      },
      adminOrder: 7,
    },
    {
      name: 'published_at',
      type: 'datetime',
      localeAware: false,
      required: false,
      description: { tr: 'Yayın Tarihi', en: 'Published Date' },
      adminOrder: 8,
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
        { field: 'category_id', sortable: false, width: '160px', displayLocale: 'current' },
        { field: 'taken_at', sortable: true, width: '120px', displayLocale: 'current' },
        { field: 'published_at', sortable: true, width: '140px', displayLocale: 'current' },
      ],
      filters: [
        {
          field: 'category_id',
          type: 'category-tree',
          label: { tr: 'Kategori', en: 'Category' },
        },
        {
          field: 'taken_at',
          type: 'date-range',
          label: { tr: 'Çekim Tarihi', en: 'Taken Date' },
        },
      ],
      searchableFields: ['title', 'description'],
      defaultSort: { field: 'published_at', direction: 'desc' },
      pageSize: 30,
      showLocaleBadges: true,
    },
    detailView: {
      tabs: [
        { id: 'info', label: { tr: 'Bilgi', en: 'Info' }, order: 0 },
        { id: 'gallery', label: { tr: 'Galeri', en: 'Gallery' }, order: 1 },
        { id: 'seo', label: { tr: 'SEO', en: 'SEO' }, order: 2 },
        { id: 'publish', label: { tr: 'Yayınla', en: 'Publish' }, order: 3 },
      ],
      fieldGroups: [
        {
          tabId: 'info',
          title: { tr: 'Galeri Bilgileri', en: 'Gallery Info' },
          fields: ['slug', 'title', 'description', 'category_id', 'taken_at'],
          collapsed: false,
        },
        {
          tabId: 'gallery',
          title: { tr: 'Görseller', en: 'Images' },
          fields: ['cover_image', 'images'],
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
        id: 'move-category',
        label: { tr: 'Kategori Değiştir', en: 'Change Category' },
        icon: 'FolderTree',
      },
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
      itemsPerPage: 24,
      filters: [
        {
          field: 'category_id',
          type: 'category-tree',
          label: { tr: 'Kategori', en: 'Category' },
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
          id: 'taken-newest',
          field: 'taken_at',
          direction: 'desc',
          label: { tr: 'Çekim Tarihi', en: 'Taken Date' },
        },
      ],
      emptyStateMessage: {
        tr: 'Galeri henüz eklenmemiş.',
        en: 'No galleries yet.',
      },
      showPagination: true,
    },
    detailPage: {
      layout: 'showcase',
      sections: [
        { id: 'cover', order: 0, required: true },
        { id: 'title', order: 1, required: true },
        { id: 'description', order: 2, required: false },
        { id: 'gallery_grid', order: 3, required: true },
      ],
      relatedModuleId: 'gallery',
      relatedLogic: 'same-category',
      relatedCount: 4,
    },
    homeSections: [
      {
        variantId: 'gallery-masonry-6',
        displayName: {
          tr: 'Galeri Masonry (6 öğe)',
          en: 'Gallery Masonry (6 items)',
        },
        defaultCount: 6,
        selectionLogic: 'latest',
      },
      {
        variantId: 'gallery-grid-3col',
        displayName: {
          tr: 'Galeri Grid (3 Sütun)',
          en: 'Gallery Grid (3 Cols)',
        },
        defaultCount: 9,
        selectionLogic: 'latest',
      },
      // H6 Sprint 9 — P1 konsolidasyonu (gallery-preview bağımsız değil)
      {
        variantId: 'gallery-preview',
        displayName: {
          tr: 'Galeri Önizleme',
          en: 'Gallery Preview',
        },
        defaultCount: 6,
        selectionLogic: 'latest',
      },
    ],
    urlPattern: '/gallery/[...slug]',
  },

  content: {
    architectRules: [
      {
        trigger: 'sector:agency',
        rule: {
          tr: 'Ajans galerisi = portföy. 5-12 galeri, her biri 10-20 görsel. Kategori: sektör veya hizmet tipi.',
          en: 'Agency gallery = portfolio. 5-12 galleries, each 10-20 images. Categories: sector or service type.',
        },
        priority: 8,
      },
      {
        trigger: 'sector:beauty',
        rule: {
          tr: 'Kuaför/güzellik: öncesi-sonrası galeri, etkinlik fotoğrafları. 3-6 galeri.',
          en: 'Hairdresser/beauty: before-after gallery, event photos. 3-6 galleries.',
        },
        priority: 8,
      },
      {
        trigger: 'sector:restaurant',
        rule: {
          tr: 'Restoran galerisi: mekan, yemek, etkinlik. 2-4 galeri yeter.',
          en: 'Restaurant gallery: venue, food, events. 2-4 galleries suffice.',
        },
        priority: 7,
      },
      {
        trigger: 'always',
        rule: {
          tr: 'Uydurma görsel URL yasak — brief\'te yoksa cover_image ve images placeholder bırak.',
          en: 'Fabricated image URLs forbidden — leave cover_image and images as placeholder if not in brief.',
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
            title: { tr: 'Örnek Galeri', en: 'Sample Gallery' },
            description: {
              tr: 'Demo galeri açıklaması — müşteri güncelleyecek.',
              en: 'Demo gallery description — to be updated by client.',
            },
          },
        ],
      },
    ],
  },

  seo: {
    schemaType: 'ImageGallery',
    canonicalPattern: '/gallery/{category_path}/{slug}',
    sitemapIncluded: true,
    sitemapPriority: 0.5,
    sitemapChangefreq: 'monthly',
    defaultMetaTitle: '{title} | {siteName}',
    defaultMetaDescription: '{description}',
    hreflangEnabled: true,
  },

  validation: {
    required: {
      tr: ['slug', 'title', 'cover_image', 'images'],
      en: ['slug', 'title', 'cover_image', 'images'],
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
