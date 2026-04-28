import type { ModuleSpec } from '../module-spec-types.js';

// ---------------------------------------------------------------------------
// Newsletter section module spec — H6 Sprint 7
//
// type: 'section' + email capture. V1 basit: public form submit → DB'ye
// kaydeder. Otomatik email yok (admin manuel gönderir veya Resend panel
// entegrasyonu H7+'ye). Admin'de subscriber listesi + CSV export.
// ---------------------------------------------------------------------------

export const newsletterSpec: ModuleSpec = {
  meta: {
    id: 'newsletter',
    type: 'section',
    displayName: { tr: 'Bülten', en: 'Newsletter' },
    description: {
      tr: 'E-posta bülten abone listesi (V1 basit — otomatik email yok)',
      en: 'Email newsletter subscriber list (V1 simple — no automated email)',
    },
    icon: 'Mail',
    priority: 'medium',
    hasDetailPage: false,
    hasHomeSection: true,
    version: '1.0.0',
    since: '2026-04-20',
  },

  database: {
    tableName: 'module_newsletter',
    indexes: [
      {
        name: 'idx_newsletter_project_subscribed',
        columns: ['project_id', 'subscribed_at DESC'],
        method: 'btree',
        unique: false,
        description: 'Admin listesi newest-first',
      },
      {
        name: 'idx_newsletter_email_per_project',
        columns: ['project_id', 'email'],
        method: 'btree',
        unique: true,
        description: 'Bir projede aynı e-posta iki kez abone olmasın',
      },
    ],
    rlsPolicies: [
      {
        name: 'newsletter_service_all',
        action: 'all',
        using: "auth.role() = 'service_role'",
      },
    ],
    triggers: [],
  },

  fields: [
    {
      name: 'email',
      type: 'email',
      localeAware: false,
      required: true,
      maxLength: 254,
      description: { tr: 'E-posta', en: 'Email' },
      adminOrder: 1,
    },
    {
      name: 'subscribed_at',
      type: 'datetime',
      localeAware: false,
      required: true,
      description: { tr: 'Abone Tarihi', en: 'Subscribed At' },
      adminOrder: 2,
    },
    {
      name: 'locale',
      type: 'text',
      localeAware: false,
      required: false,
      maxLength: 10,
      description: { tr: 'Dil', en: 'Locale' },
      adminHelp: {
        tr: 'Abonenin kaydolduğu dil (tr/en).',
        en: 'Locale the subscriber signed up in.',
      },
      adminOrder: 3,
    },
    {
      name: 'source',
      type: 'text',
      localeAware: false,
      required: false,
      maxLength: 160,
      description: { tr: 'Kaynak', en: 'Source' },
      adminHelp: {
        tr: 'Hangi sayfadan abone oldu (URL veya section ID).',
        en: 'Which page/section triggered subscription.',
      },
      adminOrder: 4,
    },
    {
      name: 'confirmed',
      type: 'boolean',
      localeAware: false,
      required: false,
      default: false,
      description: { tr: 'Doğrulandı', en: 'Confirmed' },
      adminHelp: {
        tr: 'Double opt-in için (V1\'de kullanılmıyor, H7+).',
        en: 'For double opt-in (unused in V1, H7+).',
      },
      adminOrder: 5,
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
        { field: 'email', sortable: true, displayLocale: 'current' },
        { field: 'subscribed_at', sortable: true, width: '180px', displayLocale: 'current' },
        { field: 'locale', sortable: true, width: '80px', displayLocale: 'current' },
        { field: 'source', sortable: false, width: '200px', displayLocale: 'current' },
        { field: 'confirmed', sortable: true, width: '100px', displayLocale: 'current' },
      ],
      filters: [
        {
          field: 'locale',
          type: 'enum-select',
          label: { tr: 'Dil', en: 'Locale' },
        },
        {
          field: 'confirmed',
          type: 'boolean',
          label: { tr: 'Doğrulanmış', en: 'Confirmed' },
        },
        {
          field: 'subscribed_at',
          type: 'date-range',
          label: { tr: 'Abone Tarihi', en: 'Subscribed' },
        },
      ],
      searchableFields: ['email', 'source'],
      defaultSort: { field: 'subscribed_at', direction: 'desc' },
      pageSize: 100,
      showLocaleBadges: false,
    },
    detailView: {
      tabs: [
        { id: 'info', label: { tr: 'Abone', en: 'Subscriber' }, order: 0 },
      ],
      fieldGroups: [
        {
          tabId: 'info',
          title: { tr: 'Abone Bilgisi', en: 'Subscriber Info' },
          fields: ['email', 'subscribed_at', 'locale', 'source', 'confirmed'],
          collapsed: false,
        },
      ],
      previewEnabled: false,
      autoSaveDraft: false,
      showCharCount: false,
    },
    bulkActions: [
      { id: 'confirm', label: { tr: 'Doğrula', en: 'Confirm' }, icon: 'CheckCircle' },
      { id: 'export-csv', label: { tr: 'CSV İndir', en: 'Export CSV' }, icon: 'Download' },
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
        variantId: 'newsletter-inline',
        displayName: { tr: 'Bülten Inline', en: 'Newsletter Inline' },
        defaultCount: 1,
        selectionLogic: 'manual',
      },
      {
        variantId: 'newsletter-card',
        displayName: { tr: 'Bülten Kart', en: 'Newsletter Card' },
        defaultCount: 1,
        selectionLogic: 'manual',
      },
      {
        variantId: 'newsletter-footer',
        displayName: { tr: 'Bülten Footer', en: 'Newsletter Footer' },
        defaultCount: 1,
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
          tr: 'Newsletter section başlık + açıklama + CTA metni — müşteri panelden değiştirecek. Form endpoint: /api/newsletter POST.',
          en: 'Newsletter section title + description + CTA — client edits via admin. Form endpoint: /api/newsletter POST.',
        },
        priority: 8,
      },
    ],
    placeholderStrategy: 'auto',
    samplePatterns: [],
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
      tr: ['email'],
      en: ['email'],
    },
    unique: [
      {
        field: 'email',
        scope: 'per-project',
        description: 'Aynı proje için aynı email iki kez abone olmasın',
      },
    ],
    businessRules: [],
  },
};
