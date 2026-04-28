import type { ModuleSpec } from '../module-spec-types.js';

// ---------------------------------------------------------------------------
// Team module spec — H6 Sprint 3
//
// Ekip üyesi listesi — flat (kategori yok), profil layout, kişi adı locale
// bağımsız (kişi adı zaten tek biçim). Person schema.org. Hukuki ofis,
// ajans, kurumsal sitelerde kritik.
// ---------------------------------------------------------------------------

export const teamSpec: ModuleSpec = {
  meta: {
    id: 'team',
    displayName: { tr: 'Ekip', en: 'Team' },
    description: {
      tr: 'Ekip üyeleri — kişi profili, unvan, biyografi, iletişim',
      en: 'Team members — person profile, role, bio, contact',
    },
    icon: 'Users',
    priority: 'high',
    hasDetailPage: true,
    hasHomeSection: true,
    version: '1.0.0',
    since: '2026-04-20',
  },

  database: {
    tableName: 'module_team',
    indexes: [
      {
        name: 'idx_team_project_sort',
        columns: ['project_id', 'sort_order ASC'],
        method: 'btree',
        unique: false,
        description: 'Liste sayfası sort by sort_order',
      },
      {
        name: 'idx_team_slug_gin',
        columns: ['slug'],
        method: 'gin',
        unique: false,
      },
    ],
    rlsPolicies: [
      {
        name: 'team_service_all',
        action: 'all',
        using: "auth.role() = 'service_role'",
      },
      {
        name: 'team_public_read',
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
      name: 'name',
      type: 'text',
      localeAware: false,
      required: true,
      maxLength: 160,
      seoRelevant: true,
      indexForSearch: true,
      description: { tr: 'Kişi Adı', en: 'Person Name' },
      adminHelp: {
        tr: 'Kişinin tam adı — locale bağımsız.',
        en: 'Full name of the person — locale-independent.',
      },
      adminOrder: 2,
    },
    {
      name: 'role',
      type: 'text',
      localeAware: true,
      required: true,
      maxLength: 160,
      seoRelevant: true,
      description: { tr: 'Unvan / Pozisyon', en: 'Role / Position' },
      adminHelp: {
        tr: 'Örn: "Kurucu Ortak", "Kıdemli Avukat", "Tasarım Direktörü".',
        en: 'E.g. "Founding Partner", "Senior Lawyer", "Design Director".',
      },
      adminOrder: 3,
    },
    {
      name: 'bio',
      type: 'richtext',
      localeAware: true,
      required: false,
      description: { tr: 'Biyografi', en: 'Biography' },
      adminHelp: {
        tr: 'Kısa özgeçmiş — 2-4 paragraf önerilir.',
        en: 'Short bio — 2-4 paragraphs recommended.',
      },
      adminOrder: 4,
    },
    {
      name: 'photo',
      type: 'media_ref',
      localeAware: false,
      required: true,
      description: { tr: 'Profil Fotoğrafı', en: 'Profile Photo' },
      adminHelp: {
        tr: 'Kare veya dikey (3:4) görsel önerilir.',
        en: 'Square or portrait (3:4) image recommended.',
      },
      adminOrder: 5,
    },
    {
      name: 'email',
      type: 'email',
      localeAware: false,
      required: false,
      description: { tr: 'E-posta', en: 'Email' },
      adminOrder: 6,
    },
    {
      name: 'phone',
      type: 'phone',
      localeAware: false,
      required: false,
      description: { tr: 'Telefon', en: 'Phone' },
      adminOrder: 7,
    },
    {
      name: 'social_links',
      type: 'jsonb',
      localeAware: false,
      required: false,
      description: { tr: 'Sosyal Medya', en: 'Social Links' },
      adminHelp: {
        tr: 'linkedin, twitter, github gibi key-value.',
        en: 'Key-value like linkedin, twitter, github.',
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
      adminHelp: {
        tr: 'Küçük değer önce görünür.',
        en: 'Lower value shown first.',
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
        { field: 'name', sortable: true, displayLocale: 'current' },
        { field: 'role', sortable: true, displayLocale: 'current' },
        { field: 'sort_order', sortable: true, width: '100px', displayLocale: 'current' },
        { field: 'published_at', sortable: true, width: '140px', displayLocale: 'current' },
      ],
      filters: [],
      searchableFields: ['name', 'role'],
      defaultSort: { field: 'sort_order', direction: 'asc' },
      pageSize: 50,
      showLocaleBadges: true,
    },
    detailView: {
      tabs: [
        { id: 'profile', label: { tr: 'Profil', en: 'Profile' }, order: 0 },
        { id: 'contact', label: { tr: 'İletişim', en: 'Contact' }, order: 1 },
        { id: 'media', label: { tr: 'Medya', en: 'Media' }, order: 2 },
        { id: 'seo', label: { tr: 'SEO', en: 'SEO' }, order: 3 },
        { id: 'publish', label: { tr: 'Yayınla', en: 'Publish' }, order: 4 },
      ],
      fieldGroups: [
        {
          tabId: 'profile',
          title: { tr: 'Kişi Bilgileri', en: 'Person Info' },
          fields: ['slug', 'name', 'role', 'bio', 'sort_order'],
          collapsed: false,
        },
        {
          tabId: 'contact',
          title: { tr: 'İletişim', en: 'Contact' },
          fields: ['email', 'phone', 'social_links'],
          collapsed: false,
        },
        {
          tabId: 'media',
          title: { tr: 'Fotoğraf', en: 'Photo' },
          fields: ['photo'],
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
      itemsPerPage: 12,
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
        tr: 'Ekip üyesi eklenmemiş.',
        en: 'No team members yet.',
      },
      showPagination: true,
    },
    detailPage: {
      layout: 'profile',
      sections: [
        { id: 'hero_photo', order: 0, required: true },
        { id: 'name_role', order: 1, required: true },
        { id: 'bio', order: 2, required: false },
        { id: 'contact', order: 3, required: false },
        { id: 'social', order: 4, required: false },
      ],
      relatedModuleId: 'team',
      relatedLogic: 'manual',
      relatedCount: 3,
    },
    homeSections: [
      {
        variantId: 'team-grid-3col',
        displayName: {
          tr: 'Ekip Grid (3 Sütun)',
          en: 'Team Grid (3 Cols)',
        },
        defaultCount: 6,
        selectionLogic: 'manual',
      },
      {
        variantId: 'team-masonry',
        displayName: {
          tr: 'Ekip Masonry',
          en: 'Team Masonry',
        },
        defaultCount: 9,
        selectionLogic: 'manual',
      },
    ],
    urlPattern: '/team/[slug]',
  },

  content: {
    architectRules: [
      {
        trigger: 'sector:law',
        rule: {
          tr: 'Ekip sayfası kritik güven sinyali — 3-5 kişi (kurucu + kıdemli avukat + uzmanlık alanı belirtilmiş). Unvan net: "Ortak", "Kıdemli Avukat".',
          en: 'Team page is critical trust signal — 3-5 persons (founder + senior + specialty). Titles clear: "Partner", "Senior Lawyer".',
        },
        priority: 9,
      },
      {
        trigger: 'sector:agency',
        rule: {
          tr: 'Ajans ekibi genç, kreatif ton — 4-8 kişi. Unvanlar modern: "Design Lead", "Growth Specialist".',
          en: 'Agency team young, creative tone — 4-8 persons. Modern titles: "Design Lead", "Growth Specialist".',
        },
        priority: 7,
      },
      {
        trigger: 'sector:beauty',
        rule: {
          tr: 'Uzman kadrosu — 3-6 kişi (kurucu + uzman estetisyen/kuaför). Biyografi deneyim odaklı.',
          en: 'Expert staff — 3-6 persons (founder + specialist). Bio experience-focused.',
        },
        priority: 7,
      },
      {
        trigger: 'always',
        rule: {
          tr: 'Rakamsal iddia yasağı — "15 yıllık tecrübe" gibi spesifik sayı brief\'te yoksa uydurma.',
          en: 'No numerical claims — do not fabricate specific numbers like "15 years of experience" if not in brief.',
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
            name: 'Örnek İsim',
            role: { tr: 'Kurucu Ortak', en: 'Founding Partner' },
            bio: {
              tr: 'Demo biyografi — müşteri panelden güncelleyecek.',
              en: 'Demo bio — to be updated by client via admin.',
            },
          },
        ],
      },
    ],
  },

  seo: {
    schemaType: 'Person',
    canonicalPattern: '/team/{slug}',
    sitemapIncluded: true,
    sitemapPriority: 0.5,
    sitemapChangefreq: 'monthly',
    defaultMetaTitle: '{name} — {role} | {siteName}',
    defaultMetaDescription: '{bio}',
    hreflangEnabled: true,
  },

  validation: {
    required: {
      tr: ['slug', 'name', 'role', 'photo'],
      en: ['slug', 'name', 'role', 'photo'],
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
