import type { ModuleSpec } from '../module-spec-types.js';

// ---------------------------------------------------------------------------
// Certificates module spec — H6 Sprint 4
//
// Sertifika / ödül / akreditasyon listesi. Avukat ofisleri, hekim, eğitim
// kurumları, danışmanlık için kritik güven sinyali. Flat liste, detay
// sayfası büyük görsel + açıklama. Schema.org CreativeWork.
// ---------------------------------------------------------------------------

export const certificatesSpec: ModuleSpec = {
  meta: {
    id: 'certificates',
    displayName: { tr: 'Sertifikalar', en: 'Certificates' },
    description: {
      tr: 'Sertifika, ödül, akreditasyon listesi — güven sinyali',
      en: 'Certificates, awards, accreditations — trust signal',
    },
    icon: 'BadgeCheck',
    priority: 'high',
    hasDetailPage: true,
    hasHomeSection: true,
    version: '1.0.0',
    since: '2026-04-20',
  },

  database: {
    tableName: 'module_certificates',
    indexes: [
      {
        name: 'idx_certificates_project_sort',
        columns: ['project_id', 'sort_order ASC'],
        method: 'btree',
        unique: false,
        description: 'Liste sayfası sort by sort_order',
      },
      {
        name: 'idx_certificates_issue_date',
        columns: ['project_id', 'issue_date DESC'],
        method: 'btree',
        unique: false,
        description: 'Tarih bazlı sıralama',
      },
      {
        name: 'idx_certificates_slug_gin',
        columns: ['slug'],
        method: 'gin',
        unique: false,
      },
    ],
    rlsPolicies: [
      {
        name: 'certificates_service_all',
        action: 'all',
        using: "auth.role() = 'service_role'",
      },
      {
        name: 'certificates_public_read',
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
      description: { tr: 'Sertifika Adı', en: 'Certificate Title' },
      adminOrder: 2,
    },
    {
      name: 'issuer',
      type: 'text',
      localeAware: false,
      required: true,
      maxLength: 200,
      description: { tr: 'Veren Kurum', en: 'Issuer' },
      adminHelp: {
        tr: 'ISO, TSE, üniversite gibi — kurum adı locale bağımsız.',
        en: 'ISO, TSE, university — issuer name locale-independent.',
      },
      adminOrder: 3,
    },
    {
      name: 'issue_date',
      type: 'date',
      localeAware: false,
      required: true,
      description: { tr: 'Veriliş Tarihi', en: 'Issue Date' },
      adminOrder: 4,
    },
    {
      name: 'expiry_date',
      type: 'date',
      localeAware: false,
      required: false,
      description: { tr: 'Son Geçerlilik Tarihi', en: 'Expiry Date' },
      adminHelp: {
        tr: 'Süresiz sertifikalar için boş bırakın.',
        en: 'Leave empty for certificates without expiry.',
      },
      adminOrder: 5,
    },
    {
      name: 'certificate_number',
      type: 'text',
      localeAware: false,
      required: false,
      maxLength: 120,
      description: { tr: 'Sertifika Numarası', en: 'Certificate Number' },
      adminOrder: 6,
    },
    {
      name: 'image_url',
      type: 'media_ref',
      localeAware: false,
      required: true,
      description: { tr: 'Sertifika Görseli', en: 'Certificate Image' },
      adminHelp: {
        tr: 'Tarayıcı PDF veya yüksek çözünürlüklü PNG/JPG.',
        en: 'Scanned PDF or high-resolution PNG/JPG.',
      },
      adminOrder: 7,
    },
    {
      name: 'description',
      type: 'richtext',
      localeAware: true,
      required: false,
      description: { tr: 'Açıklama', en: 'Description' },
      adminHelp: {
        tr: 'Sertifikanın kapsamı, neyi belgelediği (opsiyonel).',
        en: 'Scope and purpose of the certificate (optional).',
      },
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
        { field: 'issuer', sortable: true, width: '180px', displayLocale: 'current' },
        { field: 'issue_date', sortable: true, width: '120px', displayLocale: 'current' },
        { field: 'expiry_date', sortable: true, width: '120px', displayLocale: 'current' },
        { field: 'sort_order', sortable: true, width: '100px', displayLocale: 'current' },
      ],
      filters: [
        {
          field: 'issuer',
          type: 'text-search',
          label: { tr: 'Veren Kurum', en: 'Issuer' },
        },
        {
          field: 'issue_date',
          type: 'date-range',
          label: { tr: 'Veriliş Tarihi', en: 'Issue Date' },
        },
      ],
      searchableFields: ['title', 'issuer'],
      defaultSort: { field: 'sort_order', direction: 'asc' },
      pageSize: 50,
      showLocaleBadges: true,
    },
    detailView: {
      tabs: [
        { id: 'info', label: { tr: 'Bilgi', en: 'Info' }, order: 0 },
        { id: 'media', label: { tr: 'Görsel', en: 'Image' }, order: 1 },
        { id: 'seo', label: { tr: 'SEO', en: 'SEO' }, order: 2 },
        { id: 'publish', label: { tr: 'Yayınla', en: 'Publish' }, order: 3 },
      ],
      fieldGroups: [
        {
          tabId: 'info',
          title: { tr: 'Sertifika Bilgileri', en: 'Certificate Info' },
          fields: ['slug', 'title', 'issuer', 'issue_date', 'expiry_date', 'certificate_number', 'description', 'sort_order'],
          collapsed: false,
        },
        {
          tabId: 'media',
          title: { tr: 'Görsel', en: 'Image' },
          fields: ['image_url'],
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
      layout: 'grid',
      itemsPerPage: 20,
      filters: [],
      sortOptions: [
        {
          id: 'sort-order',
          field: 'sort_order',
          direction: 'asc',
          label: { tr: 'Varsayılan Sıra', en: 'Default Order' },
        },
        {
          id: 'newest',
          field: 'issue_date',
          direction: 'desc',
          label: { tr: 'En Yeni', en: 'Newest First' },
        },
      ],
      emptyStateMessage: {
        tr: 'Sertifika henüz eklenmemiş.',
        en: 'No certificates yet.',
      },
      showPagination: true,
    },
    detailPage: {
      layout: 'article',
      sections: [
        { id: 'image', order: 0, required: true },
        { id: 'title', order: 1, required: true },
        { id: 'issuer_meta', order: 2, required: true },
        { id: 'description', order: 3, required: false },
        { id: 'certificate_info', order: 4, required: false },
      ],
      relatedModuleId: 'certificates',
      relatedLogic: 'latest',
      relatedCount: 3,
    },
    homeSections: [
      {
        variantId: 'certificate-strip',
        displayName: {
          tr: 'Sertifika Şeridi',
          en: 'Certificate Strip',
        },
        defaultCount: 6,
        selectionLogic: 'manual',
      },
      {
        variantId: 'certificate-grid-4col',
        displayName: {
          tr: 'Sertifika Grid (4 Sütun)',
          en: 'Certificate Grid (4 Cols)',
        },
        defaultCount: 8,
        selectionLogic: 'latest',
      },
    ],
    urlPattern: '/certificates/[slug]',
  },

  content: {
    architectRules: [
      {
        trigger: 'sector:law',
        rule: {
          tr: 'Hukuki ofis sertifika sayfası kritik — baro, uluslararası akreditasyon, mevzuat eğitimi. 4-8 öğe önerilir.',
          en: 'Law firm certificates page critical — bar association, international accreditation. 4-8 items recommended.',
        },
        priority: 9,
      },
      {
        trigger: 'sector:medical',
        rule: {
          tr: 'Tıbbi kurumlar için akreditasyon + sertifika zorunlu. ISO 9001, TSE Sağlık, JCI gibi.',
          en: 'Accreditation + certificates mandatory for medical institutions. ISO 9001, TSE Health, JCI etc.',
        },
        priority: 10,
      },
      {
        trigger: 'sector:consulting',
        rule: {
          tr: 'Danışmanlık sektörü için: uzmanlık sertifikaları, kurumsal üyelikler. 5-10 öğe.',
          en: 'Consulting sector: expertise certificates, memberships. 5-10 items.',
        },
        priority: 8,
      },
      {
        trigger: 'always',
        rule: {
          tr: 'Uydurma sertifika YASAK — brief\'te yoksa placeholder "Örnek Sertifika", müşteri panelden yükleyecek.',
          en: 'Fabricated certificates FORBIDDEN — if not in brief, placeholder "Sample Certificate", client uploads via admin.',
        },
        priority: 10,
      },
    ],
    placeholderStrategy: 'auto',
    samplePatterns: [
      {
        sector: 'law',
        count: 3,
        samples: [
          {
            title: { tr: 'Örnek Sertifika', en: 'Sample Certificate' },
            issuer: 'Demo Kurum',
            description: {
              tr: 'Demo açıklama — müşteri panelden güncelleyecek.',
              en: 'Demo description — to be updated by client via admin.',
            },
          },
        ],
      },
    ],
  },

  seo: {
    schemaType: 'CreativeWork',
    canonicalPattern: '/certificates/{slug}',
    sitemapIncluded: true,
    sitemapPriority: 0.5,
    sitemapChangefreq: 'monthly',
    defaultMetaTitle: '{title} | {siteName}',
    defaultMetaDescription: '{description}',
    hreflangEnabled: true,
  },

  validation: {
    required: {
      tr: ['slug', 'title', 'issuer', 'issue_date', 'image_url'],
      en: ['slug', 'title', 'issuer', 'issue_date', 'image_url'],
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
