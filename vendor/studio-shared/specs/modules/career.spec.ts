import type { ModuleSpec } from '../module-spec-types.js';

// ---------------------------------------------------------------------------
// Career module spec — H6 Sprint 5
//
// İş ilanları modülü. Departman bazlı flat kategori (opsiyonel), esnek
// başvuru form şeması (jsonb), employment_type enum, JobPosting schema.org.
// Ajans, SaaS, kurumsal şirketler için kritik.
// ---------------------------------------------------------------------------

export const careerSpec: ModuleSpec = {
  meta: {
    id: 'career',
    displayName: { tr: 'Kariyer', en: 'Careers' },
    description: {
      tr: 'İş ilanları — açık pozisyonlar, başvuru formu',
      en: 'Job postings — open positions, application form',
    },
    icon: 'Briefcase',
    priority: 'medium',
    hasDetailPage: true,
    hasHomeSection: true,
    version: '1.0.0',
    since: '2026-04-20',
  },

  database: {
    tableName: 'module_career',
    indexes: [
      {
        name: 'idx_career_project_active',
        columns: ['project_id', 'is_active'],
        method: 'btree',
        unique: false,
        description: 'Aktif ilan sorgusu',
      },
      {
        name: 'idx_career_slug_gin',
        columns: ['slug'],
        method: 'gin',
        unique: false,
      },
    ],
    rlsPolicies: [
      {
        name: 'career_service_all',
        action: 'all',
        using: "auth.role() = 'service_role'",
      },
      {
        name: 'career_public_read',
        action: 'select',
        using: 'is_active = true AND published_at IS NOT NULL AND published_at <= now()',
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
      description: { tr: 'Pozisyon Başlığı', en: 'Position Title' },
      adminHelp: {
        tr: 'Örn: "Kıdemli Frontend Developer", "Growth Marketing Lead".',
        en: 'E.g. "Senior Frontend Developer", "Growth Marketing Lead".',
      },
      adminOrder: 2,
    },
    {
      name: 'department',
      type: 'text',
      localeAware: true,
      required: false,
      maxLength: 120,
      description: { tr: 'Departman', en: 'Department' },
      adminHelp: {
        tr: 'Örn: "Mühendislik", "Pazarlama", "Operasyon".',
        en: 'E.g. "Engineering", "Marketing", "Operations".',
      },
      adminOrder: 3,
    },
    {
      name: 'location',
      type: 'text',
      localeAware: false,
      required: false,
      maxLength: 160,
      description: { tr: 'Konum', en: 'Location' },
      adminHelp: {
        tr: 'Örn: "İstanbul", "Remote", "Hybrid — Ankara".',
        en: 'E.g. "Istanbul", "Remote", "Hybrid — Ankara".',
      },
      adminOrder: 4,
    },
    {
      name: 'employment_type',
      type: 'enum',
      enumValues: ['full_time', 'part_time', 'contract', 'intern'],
      localeAware: false,
      required: true,
      default: 'full_time',
      description: { tr: 'Çalışma Tipi', en: 'Employment Type' },
      adminOrder: 5,
    },
    {
      name: 'description',
      type: 'richtext',
      localeAware: true,
      required: true,
      description: { tr: 'Pozisyon Açıklaması', en: 'Position Description' },
      adminOrder: 6,
    },
    {
      name: 'requirements',
      type: 'richtext',
      localeAware: true,
      required: false,
      description: { tr: 'Gereksinimler', en: 'Requirements' },
      adminHelp: {
        tr: 'Teknik yetkinlik, tecrübe, dil, eğitim.',
        en: 'Technical skills, experience, languages, education.',
      },
      adminOrder: 7,
    },
    {
      name: 'apply_form_schema',
      type: 'jsonb',
      localeAware: false,
      required: false,
      description: { tr: 'Başvuru Form Şeması', en: 'Apply Form Schema' },
      adminHelp: {
        tr: 'Custom form alanları (isteğe bağlı). Boşsa standart başvuru formu.',
        en: 'Custom form fields (optional). Empty = standard form.',
      },
      adminOrder: 8,
    },
    {
      name: 'is_active',
      type: 'boolean',
      localeAware: false,
      required: true,
      default: true,
      description: { tr: 'Aktif', en: 'Active' },
      adminHelp: {
        tr: 'Pasif ilanlar public sayfada görünmez.',
        en: 'Inactive postings hidden from public page.',
      },
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
        { field: 'department', sortable: true, width: '160px', displayLocale: 'current' },
        { field: 'location', sortable: true, width: '140px', displayLocale: 'current' },
        { field: 'employment_type', sortable: true, width: '120px', displayLocale: 'current' },
        { field: 'is_active', sortable: true, width: '80px', displayLocale: 'current' },
        { field: 'published_at', sortable: true, width: '140px', displayLocale: 'current' },
      ],
      filters: [
        {
          field: 'employment_type',
          type: 'enum-select',
          label: { tr: 'Çalışma Tipi', en: 'Type' },
        },
        {
          field: 'is_active',
          type: 'boolean',
          label: { tr: 'Aktif', en: 'Active' },
        },
      ],
      searchableFields: ['title', 'department', 'location'],
      defaultSort: { field: 'published_at', direction: 'desc' },
      pageSize: 50,
      showLocaleBadges: true,
    },
    detailView: {
      tabs: [
        { id: 'info', label: { tr: 'Pozisyon', en: 'Position' }, order: 0 },
        { id: 'details', label: { tr: 'Detaylar', en: 'Details' }, order: 1 },
        { id: 'application', label: { tr: 'Başvuru', en: 'Application' }, order: 2 },
        { id: 'seo', label: { tr: 'SEO', en: 'SEO' }, order: 3 },
        { id: 'publish', label: { tr: 'Yayınla', en: 'Publish' }, order: 4 },
      ],
      fieldGroups: [
        {
          tabId: 'info',
          title: { tr: 'Pozisyon Bilgileri', en: 'Position Info' },
          fields: ['slug', 'title', 'department', 'location', 'employment_type'],
          collapsed: false,
        },
        {
          tabId: 'details',
          title: { tr: 'İçerik', en: 'Content' },
          fields: ['description', 'requirements'],
          collapsed: false,
        },
        {
          tabId: 'application',
          title: { tr: 'Başvuru Formu', en: 'Application Form' },
          fields: ['apply_form_schema'],
          collapsed: false,
        },
        {
          tabId: 'publish',
          title: { tr: 'Yayın', en: 'Publishing' },
          fields: ['is_active', 'published_at'],
          collapsed: false,
        },
      ],
      previewEnabled: true,
      autoSaveDraft: true,
      showCharCount: true,
    },
    bulkActions: [
      { id: 'activate', label: { tr: 'Aktifleştir', en: 'Activate' }, icon: 'CheckCircle' },
      { id: 'deactivate', label: { tr: 'Pasifleştir', en: 'Deactivate' }, icon: 'Archive' },
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
      itemsPerPage: 20,
      filters: [
        {
          field: 'employment_type',
          type: 'enum-select',
          label: { tr: 'Çalışma Tipi', en: 'Type' },
        },
      ],
      sortOptions: [
        {
          id: 'newest',
          field: 'published_at',
          direction: 'desc',
          label: { tr: 'En Yeni', en: 'Newest' },
        },
      ],
      emptyStateMessage: {
        tr: 'Şu anda açık pozisyon yok.',
        en: 'No open positions at the moment.',
      },
      showPagination: true,
    },
    detailPage: {
      layout: 'article',
      sections: [
        { id: 'header', order: 0, required: true },
        { id: 'meta_bar', order: 1, required: true },
        { id: 'description', order: 2, required: true },
        { id: 'requirements', order: 3, required: false },
        { id: 'apply_cta', order: 4, required: true },
      ],
      relatedModuleId: 'career',
      relatedLogic: 'latest',
      relatedCount: 3,
    },
    homeSections: [
      {
        variantId: 'career-list',
        displayName: {
          tr: 'Kariyer Listesi',
          en: 'Career List',
        },
        defaultCount: 5,
        selectionLogic: 'latest',
      },
      {
        variantId: 'career-cards',
        displayName: {
          tr: 'Kariyer Kartları',
          en: 'Career Cards',
        },
        defaultCount: 3,
        selectionLogic: 'latest',
      },
    ],
    urlPattern: '/career/[slug]',
  },

  content: {
    architectRules: [
      {
        trigger: 'sector:saas',
        rule: {
          tr: 'SaaS şirketi için 3-6 açık pozisyon. Teknik (Engineering) + Satış + Customer Success kritik.',
          en: 'SaaS company 3-6 open positions. Engineering + Sales + Customer Success critical.',
        },
        priority: 8,
      },
      {
        trigger: 'sector:agency',
        rule: {
          tr: 'Ajans için yaratıcı pozisyonlar — tasarımcı, copywriter, account manager. 2-5 ilan.',
          en: 'Agency creative positions — designer, copywriter, account manager. 2-5 listings.',
        },
        priority: 7,
      },
      {
        trigger: 'always',
        rule: {
          tr: 'Maaş aralığı YASAK — brief\'te net yazmadıkça "Rekabetçi" yaz. Rakamsal iddia üretme.',
          en: 'Salary range FORBIDDEN — write "Competitive" unless net in brief. No numerical claims.',
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
              tr: 'Örnek Pozisyon',
              en: 'Sample Position',
            },
            employment_type: 'full_time',
            is_active: true,
          },
        ],
      },
    ],
  },

  seo: {
    schemaType: 'JobPosting',
    canonicalPattern: '/career/{slug}',
    sitemapIncluded: true,
    sitemapPriority: 0.6,
    sitemapChangefreq: 'weekly',
    defaultMetaTitle: '{title} — {siteName}',
    defaultMetaDescription: '{description}',
    hreflangEnabled: true,
  },

  validation: {
    required: {
      tr: ['slug', 'title', 'employment_type', 'description', 'is_active'],
      en: ['slug', 'title', 'employment_type', 'description', 'is_active'],
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
