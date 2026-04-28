import type { ModuleSpec } from '../module-spec-types.js';

// ---------------------------------------------------------------------------
// Counter section module spec — H6 Sprint 7
//
// type: 'section' → sadece home section öğeleri. Detay sayfası yok, public
// liste yok. Admin'de "stat kartları" yönetimi. Örn: "500+ Proje",
// "15 Yıl Tecrübe", "%98 Memnuniyet". number + label + suffix + icon.
// ---------------------------------------------------------------------------

export const counterSpec: ModuleSpec = {
  meta: {
    id: 'counter',
    type: 'section',
    displayName: { tr: 'Sayaç', en: 'Counter' },
    description: {
      tr: 'Stat kartları — rakamsal başarı göstergeleri home section\'ı',
      en: 'Stat cards — numeric achievement indicators, home section',
    },
    icon: 'TrendingUp',
    priority: 'medium',
    hasDetailPage: false,
    hasHomeSection: true,
    version: '1.0.0',
    since: '2026-04-20',
  },

  database: {
    tableName: 'module_counter',
    indexes: [
      {
        name: 'idx_counter_project_sort',
        columns: ['project_id', 'sort_order ASC'],
        method: 'btree',
        unique: false,
      },
    ],
    rlsPolicies: [
      {
        name: 'counter_service_all',
        action: 'all',
        using: "auth.role() = 'service_role'",
      },
      {
        name: 'counter_public_read',
        action: 'select',
        using: 'published_at IS NOT NULL AND published_at <= now()',
      },
    ],
    triggers: [],
  },

  fields: [
    {
      name: 'label',
      type: 'text',
      localeAware: true,
      required: true,
      maxLength: 160,
      description: { tr: 'Etiket', en: 'Label' },
      adminHelp: {
        tr: 'Örn: "Tamamlanan Proje", "Mutlu Müşteri", "Yıl Tecrübe".',
        en: 'E.g. "Completed Projects", "Happy Clients", "Years Experience".',
      },
      adminOrder: 1,
    },
    {
      name: 'value',
      type: 'number',
      localeAware: false,
      required: true,
      description: { tr: 'Değer', en: 'Value' },
      adminHelp: {
        tr: 'Sayı — sadece rakam (500, 15, 98). Suffix ayrı alanda.',
        en: 'Number only (500, 15, 98). Suffix in separate field.',
      },
      adminOrder: 2,
    },
    {
      name: 'suffix',
      type: 'text',
      localeAware: true,
      required: false,
      maxLength: 20,
      description: { tr: 'Ek', en: 'Suffix' },
      adminHelp: {
        tr: 'Örn: "+", "%", "M", "yıl".',
        en: 'E.g. "+", "%", "M", "years".',
      },
      adminOrder: 3,
    },
    {
      name: 'icon',
      type: 'text',
      localeAware: false,
      required: false,
      maxLength: 80,
      description: { tr: 'İkon', en: 'Icon' },
      adminHelp: {
        tr: 'Lucide icon adı — örn: "Award", "Users", "TrendingUp".',
        en: 'Lucide icon name — e.g. "Award", "Users", "TrendingUp".',
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
        { field: 'label', sortable: true, displayLocale: 'current' },
        { field: 'value', sortable: true, width: '120px', displayLocale: 'current' },
        { field: 'sort_order', sortable: true, width: '100px', displayLocale: 'current' },
      ],
      filters: [],
      searchableFields: ['label'],
      defaultSort: { field: 'sort_order', direction: 'asc' },
      pageSize: 50,
      showLocaleBadges: true,
    },
    detailView: {
      tabs: [
        { id: 'content', label: { tr: 'İçerik', en: 'Content' }, order: 0 },
      ],
      fieldGroups: [
        {
          tabId: 'content',
          title: { tr: 'Stat Bilgisi', en: 'Stat Info' },
          fields: ['label', 'value', 'suffix', 'icon', 'sort_order', 'published_at'],
          collapsed: false,
        },
      ],
      previewEnabled: false,
      autoSaveDraft: true,
      showCharCount: false,
    },
    bulkActions: [
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
    listPage: null,
    detailPage: null,
    homeSections: [
      {
        variantId: 'counter-4col',
        displayName: { tr: 'Sayaç 4 Sütun', en: 'Counter 4-Col' },
        defaultCount: 4,
        selectionLogic: 'manual',
      },
      {
        variantId: 'counter-inline',
        displayName: { tr: 'Sayaç Inline', en: 'Counter Inline' },
        defaultCount: 3,
        selectionLogic: 'manual',
      },
    ],
    urlPattern: '',
  },

  content: {
    architectRules: [
      {
        trigger: 'always',
        rule: {
          tr: 'Counter değerleri brief\'te net sayı yoksa placeholder ("0", "XX") bırak. Uydurma istatistik YASAK.',
          en: 'If brief lacks specific numbers, use placeholder ("0", "XX"). Fabricated stats FORBIDDEN.',
        },
        priority: 10,
      },
      {
        trigger: 'sector:agency',
        rule: {
          tr: 'Ajans counter: Tamamlanan Proje, Mutlu Müşteri, Yıl Tecrübe, Ödüller. 4 öğe önerilir.',
          en: 'Agency counter: Completed Projects, Happy Clients, Years Experience, Awards. 4 items recommended.',
        },
        priority: 7,
      },
    ],
    placeholderStrategy: 'auto',
    samplePatterns: [
      {
        sector: 'agency',
        count: 4,
        samples: [
          {
            label: { tr: 'Tamamlanan Proje', en: 'Completed Projects' },
            value: 0,
            suffix: { tr: '+', en: '+' },
            icon: 'Award',
          },
        ],
      },
    ],
  },

  seo: {
    schemaType: 'CreativeWork',
    canonicalPattern: '',
    sitemapIncluded: false,
    sitemapPriority: 0.0,
    sitemapChangefreq: 'yearly',
    defaultMetaTitle: '',
    defaultMetaDescription: '',
    hreflangEnabled: false,
  },

  validation: {
    required: {
      tr: ['label', 'value'],
      en: ['label', 'value'],
    },
    unique: [],
    businessRules: [],
  },
};
