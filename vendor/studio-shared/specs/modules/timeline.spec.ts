import type { ModuleSpec } from '../module-spec-types.js';

// ---------------------------------------------------------------------------
// Timeline section module spec — H6 Sprint 8
//
// type: 'section'. Event-based zaman çizelgesi — şirket tarihi, kilometre
// taşları, etkinlik geçmişi. year + month sıralama, vertical/horizontal
// home variant'ları.
// ---------------------------------------------------------------------------

export const timelineSpec: ModuleSpec = {
  meta: {
    id: 'timeline',
    type: 'section',
    displayName: { tr: 'Zaman Çizelgesi', en: 'Timeline' },
    description: {
      tr: 'Şirket tarihi, kilometre taşları, etkinlik geçmişi — event-based section',
      en: 'Company history, milestones, event history — event-based section',
    },
    icon: 'Calendar',
    priority: 'medium',
    hasDetailPage: false,
    hasHomeSection: true,
    version: '1.0.0',
    since: '2026-04-20',
  },

  database: {
    tableName: 'module_timeline',
    indexes: [
      {
        name: 'idx_timeline_project_year',
        columns: ['project_id', 'year DESC', 'month DESC NULLS LAST'],
        method: 'btree',
        unique: false,
        description: 'Year-month sıralı render',
      },
    ],
    rlsPolicies: [
      {
        name: 'timeline_service_all',
        action: 'all',
        using: "auth.role() = 'service_role'",
      },
      {
        name: 'timeline_public_read',
        action: 'select',
        using: 'published_at IS NOT NULL AND published_at <= now()',
      },
    ],
    triggers: [],
  },

  fields: [
    {
      name: 'year',
      type: 'number',
      localeAware: false,
      required: true,
      description: { tr: 'Yıl', en: 'Year' },
      adminOrder: 1,
    },
    {
      name: 'month',
      type: 'number',
      localeAware: false,
      required: false,
      description: { tr: 'Ay', en: 'Month' },
      adminHelp: {
        tr: '1-12 arası. Boş bırakılırsa sadece yıl gösterilir.',
        en: '1-12. Empty = year-only display.',
      },
      adminOrder: 2,
    },
    {
      name: 'title',
      type: 'text',
      localeAware: true,
      required: true,
      maxLength: 200,
      seoRelevant: true,
      description: { tr: 'Başlık', en: 'Title' },
      adminOrder: 3,
    },
    {
      name: 'description',
      type: 'richtext',
      localeAware: true,
      required: false,
      description: { tr: 'Açıklama', en: 'Description' },
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
        tr: 'Lucide icon adı — örn: "Rocket", "Award", "Building".',
        en: 'Lucide icon name — e.g. "Rocket", "Award", "Building".',
      },
      adminOrder: 5,
    },
    {
      name: 'image',
      type: 'media_ref',
      localeAware: false,
      required: false,
      description: { tr: 'Görsel', en: 'Image' },
      adminOrder: 6,
    },
    {
      name: 'sort_order',
      type: 'number',
      localeAware: false,
      required: false,
      default: 0,
      description: { tr: 'Sıralama (Aynı Yıl İçinde)', en: 'Sort Order (Same Year)' },
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
    enabled: false,
    hierarchical: false,
    maxDepth: 1,
    required: false,
  },

  admin: {
    listView: {
      columns: [
        { field: 'year', sortable: true, width: '80px', displayLocale: 'current' },
        { field: 'month', sortable: true, width: '70px', displayLocale: 'current' },
        { field: 'title', sortable: true, displayLocale: 'current' },
        { field: 'sort_order', sortable: true, width: '100px', displayLocale: 'current' },
      ],
      filters: [
        {
          field: 'year',
          type: 'number-range',
          label: { tr: 'Yıl', en: 'Year' },
        },
      ],
      searchableFields: ['title'],
      defaultSort: { field: 'year', direction: 'desc' },
      pageSize: 50,
      showLocaleBadges: true,
    },
    detailView: {
      tabs: [
        { id: 'content', label: { tr: 'İçerik', en: 'Content' }, order: 0 },
        { id: 'visual', label: { tr: 'Görsel', en: 'Visual' }, order: 1 },
      ],
      fieldGroups: [
        {
          tabId: 'content',
          title: { tr: 'Olay Bilgisi', en: 'Event Info' },
          fields: ['year', 'month', 'title', 'description', 'sort_order', 'published_at'],
          collapsed: false,
        },
        {
          tabId: 'visual',
          title: { tr: 'Görsel', en: 'Visual' },
          fields: ['icon', 'image'],
          collapsed: false,
        },
      ],
      previewEnabled: false,
      autoSaveDraft: true,
      showCharCount: true,
    },
    bulkActions: [
      { id: 'publish', label: { tr: 'Yayınla', en: 'Publish' }, icon: 'CheckCircle' },
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
        variantId: 'timeline-vertical',
        displayName: { tr: 'Dikey Timeline', en: 'Vertical Timeline' },
        defaultCount: 8,
        selectionLogic: 'manual',
      },
      {
        variantId: 'timeline-horizontal',
        displayName: { tr: 'Yatay Timeline', en: 'Horizontal Timeline' },
        defaultCount: 6,
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
          tr: 'Timeline event tarihleri brief\'te yoksa placeholder ("2020", "2022") bırak. Uydurma tarih YASAK.',
          en: 'If brief lacks event dates, use placeholder ("2020", "2022"). Fabricated dates FORBIDDEN.',
        },
        priority: 10,
      },
      {
        trigger: 'sector:agency',
        rule: {
          tr: 'Ajans timeline: kuruluş, büyük müşteri, yeni ofis, ödüller. 5-8 event.',
          en: 'Agency timeline: founding, big client, new office, awards. 5-8 events.',
        },
        priority: 7,
      },
      {
        trigger: 'sector:law',
        rule: {
          tr: 'Hukuki ofis timeline: kuruluş, ortak katılımı, uzmanlık alanı genişletme. 3-5 event.',
          en: 'Law firm timeline: founding, partner joins, practice expansion. 3-5 events.',
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
            year: 2020,
            title: { tr: 'Kuruluş', en: 'Founded' },
            description: {
              tr: 'Demo event — müşteri güncelleyecek.',
              en: 'Demo event — to be updated by client.',
            },
            icon: 'Rocket',
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
      tr: ['year', 'title'],
      en: ['year', 'title'],
    },
    unique: [],
    businessRules: [
      {
        id: 'month-range',
        expression: 'month IS NULL OR (month >= 1 AND month <= 12)',
        errorMessage: {
          tr: 'Ay 1-12 arası olmalı',
          en: 'Month must be between 1-12',
        },
      },
    ],
  },
};
