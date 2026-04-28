import type { ModuleSpec } from '../module-spec-types.js';

// ---------------------------------------------------------------------------
// Contact cards section module spec — H6 Sprint 8
//
// type: 'section'. İletişim kartları home section için — telefon, e-posta,
// adres, çalışma saatleri. Basit flat liste, icon + label + value + link.
// ---------------------------------------------------------------------------

export const contactCardsSpec: ModuleSpec = {
  meta: {
    id: 'contact-cards',
    type: 'section',
    displayName: { tr: 'İletişim Kartları', en: 'Contact Cards' },
    description: {
      tr: 'İletişim bilgileri — telefon, e-posta, adres, çalışma saatleri home section',
      en: 'Contact info cards — phone, email, address, hours home section',
    },
    icon: 'Phone',
    priority: 'medium',
    hasDetailPage: false,
    hasHomeSection: true,
    version: '1.0.0',
    since: '2026-04-20',
  },

  database: {
    tableName: 'module_contact_cards',
    indexes: [
      {
        name: 'idx_contact_cards_project_sort',
        columns: ['project_id', 'sort_order ASC'],
        method: 'btree',
        unique: false,
      },
    ],
    rlsPolicies: [
      {
        name: 'contact_cards_service_all',
        action: 'all',
        using: "auth.role() = 'service_role'",
      },
      {
        name: 'contact_cards_public_read',
        action: 'select',
        using: 'published_at IS NOT NULL AND published_at <= now()',
      },
    ],
    triggers: [],
  },

  fields: [
    {
      name: 'title',
      type: 'text',
      localeAware: true,
      required: true,
      maxLength: 120,
      description: { tr: 'Başlık', en: 'Title' },
      adminHelp: {
        tr: 'Örn: "Telefon", "E-posta", "Adres", "Çalışma Saatleri".',
        en: 'E.g. "Phone", "Email", "Address", "Hours".',
      },
      adminOrder: 1,
    },
    {
      name: 'value',
      type: 'text',
      localeAware: true,
      required: true,
      maxLength: 300,
      description: { tr: 'Değer', en: 'Value' },
      adminHelp: {
        tr: 'Telefon numarası, e-posta, adres metni, saat aralığı. Locale\'a göre değişebilir (örn. adres yazımı).',
        en: 'Phone number, email, address text, hours range. May vary by locale (e.g. address formatting).',
      },
      adminOrder: 2,
    },
    {
      name: 'icon',
      type: 'text',
      localeAware: false,
      required: false,
      maxLength: 80,
      description: { tr: 'İkon', en: 'Icon' },
      adminHelp: {
        tr: 'Lucide icon adı — örn: "Phone", "Mail", "MapPin", "Clock".',
        en: 'Lucide icon name — e.g. "Phone", "Mail", "MapPin", "Clock".',
      },
      adminOrder: 3,
    },
    {
      name: 'link_url',
      type: 'url',
      localeAware: false,
      required: false,
      maxLength: 400,
      description: { tr: 'Link', en: 'Link URL' },
      adminHelp: {
        tr: 'Opsiyonel — tel:/mailto:/https:// linki. Kart tıklanabilir olur.',
        en: 'Optional — tel:/mailto:/https:// link. Card becomes clickable.',
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
        { field: 'title', sortable: true, displayLocale: 'current' },
        { field: 'value', sortable: false, displayLocale: 'current' },
        { field: 'sort_order', sortable: true, width: '100px', displayLocale: 'current' },
      ],
      filters: [],
      searchableFields: ['title'],
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
          title: { tr: 'Kart Bilgisi', en: 'Card Info' },
          fields: ['title', 'value', 'icon', 'link_url', 'sort_order', 'published_at'],
          collapsed: false,
        },
      ],
      previewEnabled: false,
      autoSaveDraft: true,
      showCharCount: false,
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
        variantId: 'contact-cards-3col',
        displayName: { tr: 'İletişim 3 Sütun', en: 'Contact 3-Col' },
        defaultCount: 3,
        selectionLogic: 'manual',
      },
      {
        variantId: 'contact-cards-inline',
        displayName: { tr: 'İletişim Inline', en: 'Contact Inline' },
        defaultCount: 4,
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
          tr: 'İletişim bilgileri brief\'te varsa doğrudan kullan. Yoksa placeholder ("Telefon: +90 xxx xxx xx xx") bırak — müşteri panelden girecek.',
          en: 'Use contact info from brief directly. If missing, placeholder ("Phone: +90 xxx xxx xx xx") — client fills via admin.',
        },
        priority: 10,
      },
    ],
    placeholderStrategy: 'auto',
    samplePatterns: [
      {
        sector: 'agency',
        count: 4,
        samples: [
          {
            title: { tr: 'Telefon', en: 'Phone' },
            value: { tr: '+90 xxx xxx xx xx', en: '+90 xxx xxx xx xx' },
            icon: 'Phone',
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
      tr: ['title', 'value'],
      en: ['title', 'value'],
    },
    unique: [],
    businessRules: [],
  },
};
