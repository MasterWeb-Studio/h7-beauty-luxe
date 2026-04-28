import type { ModuleSpec } from '../module-spec-types.js';

// ---------------------------------------------------------------------------
// References module spec — H6 Sprint 3
//
// Müşteri / referans logo listesi. Detay sayfası yok (basit grid). Home
// section yaygın: "Çalıştığımız markalar" logo bar. Organization schema.org.
// Hizmet sektörleri (ajans, hukuk, danışmanlık) için kritik güven sinyali.
// ---------------------------------------------------------------------------

export const referencesSpec: ModuleSpec = {
  meta: {
    id: 'references',
    displayName: { tr: 'Referanslar', en: 'References' },
    description: {
      tr: 'Müşteri / referans logoları — grid liste, home logo bar',
      en: 'Client / reference logos — grid list, home logo bar',
    },
    icon: 'Award',
    priority: 'high',
    hasDetailPage: false,
    hasHomeSection: true,
    version: '1.0.0',
    since: '2026-04-20',
  },

  database: {
    tableName: 'module_references',
    indexes: [
      {
        name: 'idx_references_project_sort',
        columns: ['project_id', 'sort_order ASC'],
        method: 'btree',
        unique: false,
        description: 'Liste sayfası sort by sort_order',
      },
    ],
    rlsPolicies: [
      {
        name: 'references_service_all',
        action: 'all',
        using: "auth.role() = 'service_role'",
      },
      {
        name: 'references_public_read',
        action: 'select',
        using: 'published_at IS NOT NULL AND published_at <= now()',
      },
    ],
    triggers: [],
  },

  fields: [
    {
      name: 'name',
      type: 'text',
      localeAware: false,
      required: true,
      maxLength: 160,
      seoRelevant: true,
      indexForSearch: true,
      description: { tr: 'Marka Adı', en: 'Brand Name' },
      adminHelp: {
        tr: 'Referans firmanın tam adı — locale bağımsız.',
        en: 'Full name of the reference company — locale-independent.',
      },
      adminOrder: 1,
    },
    {
      name: 'logo_url',
      type: 'media_ref',
      localeAware: false,
      required: true,
      description: { tr: 'Logo', en: 'Logo' },
      adminHelp: {
        tr: 'Tercihen PNG/SVG, şeffaf arka plan.',
        en: 'Preferably PNG/SVG with transparent background.',
      },
      adminOrder: 2,
    },
    {
      name: 'website_url',
      type: 'url',
      localeAware: false,
      required: false,
      description: { tr: 'Web Sitesi', en: 'Website URL' },
      adminOrder: 3,
    },
    {
      name: 'description',
      type: 'textarea',
      localeAware: true,
      required: false,
      maxLength: 300,
      description: { tr: 'Açıklama', en: 'Description' },
      adminHelp: {
        tr: 'Opsiyonel — çalışmanın özeti (proje/hizmet).',
        en: 'Optional — summary of the work (project/service).',
      },
      adminOrder: 4,
    },
    {
      name: 'sort_order',
      type: 'number',
      localeAware: false,
      required: false,
      default: 0,
      description: { tr: 'Sıralama', en: 'Sort Order' },
      adminOrder: 5,
    },
    {
      name: 'published_at',
      type: 'datetime',
      localeAware: false,
      required: false,
      description: { tr: 'Yayın Tarihi', en: 'Published Date' },
      adminOrder: 6,
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
        { field: 'name', sortable: true, displayLocale: 'current' },
        { field: 'website_url', sortable: false, width: '220px', displayLocale: 'current' },
        { field: 'sort_order', sortable: true, width: '100px', displayLocale: 'current' },
        { field: 'published_at', sortable: true, width: '140px', displayLocale: 'current' },
      ],
      filters: [],
      searchableFields: ['name'],
      defaultSort: { field: 'sort_order', direction: 'asc' },
      pageSize: 100,
      showLocaleBadges: false,
    },
    detailView: {
      tabs: [
        { id: 'info', label: { tr: 'Bilgi', en: 'Info' }, order: 0 },
        { id: 'media', label: { tr: 'Logo', en: 'Logo' }, order: 1 },
        { id: 'publish', label: { tr: 'Yayınla', en: 'Publish' }, order: 2 },
      ],
      fieldGroups: [
        {
          tabId: 'info',
          title: { tr: 'Marka Bilgisi', en: 'Brand Info' },
          fields: ['name', 'website_url', 'description', 'sort_order'],
          collapsed: false,
        },
        {
          tabId: 'media',
          title: { tr: 'Logo', en: 'Logo' },
          fields: ['logo_url'],
          collapsed: false,
        },
        {
          tabId: 'publish',
          title: { tr: 'Yayın', en: 'Publishing' },
          fields: ['published_at'],
          collapsed: false,
        },
      ],
      previewEnabled: false,
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
        {
          id: 'name',
          field: 'name',
          direction: 'asc',
          label: { tr: 'İsim', en: 'Name' },
        },
      ],
      emptyStateMessage: {
        tr: 'Referans eklenmemiş.',
        en: 'No references yet.',
      },
      showPagination: true,
    },
    detailPage: null,
    homeSections: [
      {
        variantId: 'reference-logo-bar',
        displayName: {
          tr: 'Logo Bar',
          en: 'Logo Bar',
        },
        defaultCount: 6,
        selectionLogic: 'manual',
      },
      {
        variantId: 'reference-grid',
        displayName: {
          tr: 'Logo Grid',
          en: 'Logo Grid',
        },
        defaultCount: 12,
        selectionLogic: 'manual',
      },
      // H6 Sprint 7 G4 — ek variant'lar (bağımsız "reference-bar" modülü yerine)
      {
        variantId: 'reference-marquee',
        displayName: {
          tr: 'Marka Şeridi (Kayar)',
          en: 'Brand Marquee (Scrolling)',
        },
        defaultCount: 10,
        selectionLogic: 'manual',
      },
      {
        variantId: 'reference-featured-trio',
        displayName: {
          tr: 'Öne Çıkan 3 Marka',
          en: 'Featured 3 Brands',
        },
        defaultCount: 3,
        selectionLogic: 'manual',
      },
      // H6 Sprint 9 — P1 modül variant konsolidasyonu (partner-bar bağımsız değil)
      {
        variantId: 'partner-bar',
        displayName: {
          tr: 'Partner Bar',
          en: 'Partner Bar',
        },
        defaultCount: 12,
        selectionLogic: 'manual',
      },
    ],
    urlPattern: '/references',
  },

  content: {
    architectRules: [
      {
        trigger: 'sector:agency',
        rule: {
          tr: 'Referanslar ajans için en güçlü sinyal — 6-12 tanınmış marka. Logo bar home\'da görünür.',
          en: 'References are strongest signal for agency — 6-12 known brands. Logo bar visible on home.',
        },
        priority: 9,
      },
      {
        trigger: 'sector:law',
        rule: {
          tr: 'Hukuki ofis referansı hassas — genellikle "çalıştığımız sektörler" olarak soyut konumlandırılır. Spesifik marka adı brief\'te varsa kullan.',
          en: 'Law firm references sensitive — usually framed as "industries served" abstractly. Specific names only if in brief.',
        },
        priority: 8,
      },
      {
        trigger: 'sector:saas',
        rule: {
          tr: 'Müşteri logoları ikna aracı — 6-12 marka. Grid veya bar.',
          en: 'Customer logos are conversion tool — 6-12 brands. Grid or bar.',
        },
        priority: 8,
      },
      {
        trigger: 'always',
        rule: {
          tr: 'Uydurma marka YASAK — brief\'te geçmiyorsa placeholder "Müşteri Logosu" bırak, müşteri panelden yükleyecek.',
          en: 'Fabricated brands FORBIDDEN — if not in brief, leave placeholder "Client Logo", client uploads via admin.',
        },
        priority: 10,
      },
    ],
    placeholderStrategy: 'auto',
    samplePatterns: [
      {
        sector: 'agency',
        count: 6,
        samples: [
          {
            name: 'Müşteri Logosu',
            description: {
              tr: 'Demo referans — müşteri gerçek logoyu panelden yükleyecek.',
              en: 'Demo reference — client uploads real logo via admin.',
            },
          },
        ],
      },
    ],
  },

  seo: {
    schemaType: 'Organization',
    canonicalPattern: '/references',
    sitemapIncluded: true,
    sitemapPriority: 0.4,
    sitemapChangefreq: 'monthly',
    defaultMetaTitle: 'Referanslar | {siteName}',
    defaultMetaDescription: 'Birlikte çalıştığımız markalar.',
    hreflangEnabled: true,
  },

  validation: {
    required: {
      tr: ['name', 'logo_url'],
      en: ['name', 'logo_url'],
    },
    unique: [],
    businessRules: [],
  },
};
