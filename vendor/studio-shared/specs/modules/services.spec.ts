import type { ModuleSpec } from '../module-spec-types.js';

// ---------------------------------------------------------------------------
// Services (detail) module spec — H6 Sprint 5
//
// Mevcut ContentPlan.services section'ı home/landing'de "kartlar" olarak
// kalır; bu modül ayrı bir ENTITY — admin'den düzenlenebilir detay
// sayfaları. Scaffolder ContentPlan services section'ını bu modüle
// bağlamaz (ayrı yaşar); müşteri admin'den hizmetleri ekler, public
// /services liste + /services/[slug] detay görünür.
//
// schema.org: Service.
// ---------------------------------------------------------------------------

export const servicesSpec: ModuleSpec = {
  meta: {
    id: 'services',
    displayName: { tr: 'Hizmetler', en: 'Services' },
    description: {
      tr: 'Hizmet katalog — detay sayfası, ikon, açıklama',
      en: 'Service catalog — detail page, icon, description',
    },
    icon: 'Layers',
    priority: 'high',
    hasDetailPage: true,
    hasHomeSection: true,
    version: '1.0.0',
    since: '2026-04-20',
  },

  database: {
    tableName: 'module_services',
    indexes: [
      {
        name: 'idx_services_project_sort',
        columns: ['project_id', 'sort_order ASC'],
        method: 'btree',
        unique: false,
        description: 'Liste sayfası sort_order',
      },
      {
        name: 'idx_services_featured',
        columns: ['project_id', 'is_featured'],
        method: 'btree',
        unique: false,
        where: 'is_featured = true',
        description: 'Öne çıkan hizmetler home section',
      },
      {
        name: 'idx_services_slug_gin',
        columns: ['slug'],
        method: 'gin',
        unique: false,
      },
    ],
    rlsPolicies: [
      {
        name: 'services_service_all',
        action: 'all',
        using: "auth.role() = 'service_role'",
      },
      {
        name: 'services_public_read',
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
      description: { tr: 'Hizmet Adı', en: 'Service Title' },
      adminOrder: 2,
    },
    {
      name: 'short_description',
      type: 'textarea',
      localeAware: true,
      required: false,
      maxLength: 300,
      seoRelevant: true,
      description: { tr: 'Kısa Açıklama', en: 'Short Description' },
      adminHelp: {
        tr: 'Kart görünümünde ve SEO meta açıklamada kullanılır.',
        en: 'Used in card view and SEO meta description.',
      },
      adminOrder: 3,
    },
    {
      name: 'description',
      type: 'richtext',
      localeAware: true,
      required: false,
      description: { tr: 'Detaylı Açıklama', en: 'Detailed Description' },
      adminOrder: 4,
    },
    {
      name: 'icon',
      type: 'text',
      localeAware: false,
      required: false,
      maxLength: 80,
      description: { tr: 'İkon', en: 'Icon' },
      adminHelp: {
        tr: 'Lucide icon adı — örn: "Sparkles", "Rocket", "Shield".',
        en: 'Lucide icon name — e.g. "Sparkles", "Rocket", "Shield".',
      },
      adminOrder: 5,
    },
    {
      name: 'image',
      type: 'media_ref',
      localeAware: false,
      required: false,
      description: { tr: 'Görsel', en: 'Image' },
      adminHelp: {
        tr: 'Detay sayfası hero görseli (opsiyonel).',
        en: 'Detail page hero image (optional).',
      },
      adminOrder: 6,
    },
    {
      name: 'features',
      type: 'string_array',
      localeAware: true,
      required: false,
      description: { tr: 'Özellikler', en: 'Features' },
      adminHelp: {
        tr: 'Hizmetin içerdiği maddeler listesi.',
        en: 'List of items included in the service.',
      },
      adminOrder: 7,
    },
    {
      name: 'is_featured',
      type: 'boolean',
      localeAware: false,
      required: false,
      default: false,
      description: { tr: 'Öne Çıkarılmış', en: 'Featured' },
      adminOrder: 8,
    },
    {
      name: 'sort_order',
      type: 'number',
      localeAware: false,
      required: false,
      default: 0,
      description: { tr: 'Sıralama', en: 'Sort Order' },
      adminOrder: 9,
    },
    {
      name: 'published_at',
      type: 'datetime',
      localeAware: false,
      required: false,
      description: { tr: 'Yayın Tarihi', en: 'Published Date' },
      adminOrder: 10,
    },
  ],

  categories: {
    enabled: false,
    hierarchical: false,
    maxDepth: 1,
    required: false,
  },

  admin: {
    listView: {
      columns: [
        { field: 'title', sortable: true, displayLocale: 'current' },
        { field: 'is_featured', sortable: true, width: '100px', displayLocale: 'current' },
        { field: 'sort_order', sortable: true, width: '100px', displayLocale: 'current' },
        { field: 'published_at', sortable: true, width: '140px', displayLocale: 'current' },
      ],
      filters: [
        {
          field: 'is_featured',
          type: 'boolean',
          label: { tr: 'Öne Çıkarılmış', en: 'Featured' },
        },
      ],
      searchableFields: ['title', 'short_description'],
      defaultSort: { field: 'sort_order', direction: 'asc' },
      pageSize: 50,
      showLocaleBadges: true,
    },
    detailView: {
      tabs: [
        { id: 'content', label: { tr: 'İçerik', en: 'Content' }, order: 0 },
        { id: 'visual', label: { tr: 'Görsel', en: 'Visual' }, order: 1 },
        { id: 'seo', label: { tr: 'SEO', en: 'SEO' }, order: 2 },
        { id: 'publish', label: { tr: 'Yayınla', en: 'Publish' }, order: 3 },
      ],
      fieldGroups: [
        {
          tabId: 'content',
          title: { tr: 'Hizmet Bilgileri', en: 'Service Info' },
          fields: ['slug', 'title', 'short_description', 'description', 'features'],
          collapsed: false,
        },
        {
          tabId: 'visual',
          title: { tr: 'Görsel', en: 'Visual' },
          fields: ['icon', 'image'],
          collapsed: false,
        },
        {
          tabId: 'publish',
          title: { tr: 'Yayın', en: 'Publishing' },
          fields: ['is_featured', 'sort_order', 'published_at'],
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
      layout: 'grid',
      itemsPerPage: 24,
      filters: [],
      sortOptions: [
        {
          id: 'sort-order',
          field: 'sort_order',
          direction: 'asc',
          label: { tr: 'Varsayılan Sıra', en: 'Default Order' },
        },
      ],
      emptyStateMessage: {
        tr: 'Hizmet eklenmemiş.',
        en: 'No services yet.',
      },
      showPagination: false,
    },
    detailPage: {
      layout: 'showcase',
      sections: [
        { id: 'hero', order: 0, required: true },
        { id: 'description', order: 1, required: true },
        { id: 'features', order: 2, required: false },
        { id: 'cta', order: 3, required: true },
      ],
      relatedModuleId: 'services',
      relatedLogic: 'manual',
      relatedCount: 3,
    },
    homeSections: [
      {
        variantId: 'service-grid-3col',
        displayName: {
          tr: 'Hizmet Grid (3 Sütun)',
          en: 'Service Grid (3 Cols)',
        },
        defaultCount: 6,
        selectionLogic: 'manual',
      },
      {
        variantId: 'service-featured',
        displayName: {
          tr: 'Öne Çıkan Hizmetler',
          en: 'Featured Services',
        },
        defaultCount: 3,
        selectionLogic: 'featured',
      },
    ],
    urlPattern: '/services/[slug]',
  },

  content: {
    architectRules: [
      {
        trigger: 'sector:agency',
        rule: {
          tr: 'Ajans hizmetleri: marka tasarımı, dijital pazarlama, SEO, reklam. 4-8 hizmet.',
          en: 'Agency services: branding, digital marketing, SEO, advertising. 4-8 services.',
        },
        priority: 8,
      },
      {
        trigger: 'sector:consulting',
        rule: {
          tr: 'Danışmanlık paketleri: strateji, eğitim, denetim. 3-6 paket.',
          en: 'Consulting packages: strategy, training, audit. 3-6 packages.',
        },
        priority: 8,
      },
      {
        trigger: 'sector:beauty',
        rule: {
          tr: 'Güzellik hizmetleri: cilt bakımı, saç, makyaj. 5-10 hizmet, features listesi net.',
          en: 'Beauty services: skincare, hair, makeup. 5-10 services, features list specific.',
        },
        priority: 9,
      },
      {
        trigger: 'always',
        rule: {
          tr: 'Not: ContentPlan.services section\'ı home\'da kalır. Bu modül ayrı entity — müşteri admin\'den ekleyecek.',
          en: 'Note: ContentPlan.services section remains on home. This module is separate entity — client adds via admin.',
        },
        priority: 7,
      },
    ],
    placeholderStrategy: 'auto',
    samplePatterns: [
      {
        sector: 'agency',
        count: 3,
        samples: [
          {
            title: { tr: 'Örnek Hizmet', en: 'Sample Service' },
            short_description: {
              tr: 'Demo kısa açıklama — müşteri güncelleyecek.',
              en: 'Demo short description — to be updated by client.',
            },
          },
        ],
      },
    ],
  },

  seo: {
    schemaType: 'Service',
    canonicalPattern: '/services/{slug}',
    sitemapIncluded: true,
    sitemapPriority: 0.7,
    sitemapChangefreq: 'monthly',
    defaultMetaTitle: '{title} — {siteName}',
    defaultMetaDescription: '{short_description}',
    hreflangEnabled: true,
  },

  validation: {
    required: {
      tr: ['slug', 'title'],
      en: ['slug', 'title'],
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
