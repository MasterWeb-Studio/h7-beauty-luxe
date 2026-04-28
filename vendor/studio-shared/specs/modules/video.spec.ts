import type { ModuleSpec } from '../module-spec-types.js';

// ---------------------------------------------------------------------------
// Video section module spec — H6 Sprint 8
//
// type: 'section'. Youtube/Vimeo video showcase. video_url'den platform +
// ID parse edilir, embed iframe render. Thumbnail manuel ya da platform
// API'sinden (v1'de manuel).
// ---------------------------------------------------------------------------

export const videoSpec: ModuleSpec = {
  meta: {
    id: 'video',
    type: 'section',
    displayName: { tr: 'Video', en: 'Video' },
    description: {
      tr: 'Youtube/Vimeo video showcase — embed iframe ile home section',
      en: 'Youtube/Vimeo video showcase — embed iframe home section',
    },
    icon: 'Video',
    priority: 'medium',
    hasDetailPage: false,
    hasHomeSection: true,
    version: '1.0.0',
    since: '2026-04-20',
  },

  database: {
    tableName: 'module_video',
    indexes: [
      {
        name: 'idx_video_project_sort',
        columns: ['project_id', 'sort_order ASC'],
        method: 'btree',
        unique: false,
      },
      {
        name: 'idx_video_featured',
        columns: ['project_id', 'is_featured'],
        method: 'btree',
        unique: false,
        where: 'is_featured = true',
        description: 'Öne çıkan video home section sorgusu',
      },
    ],
    rlsPolicies: [
      {
        name: 'video_service_all',
        action: 'all',
        using: "auth.role() = 'service_role'",
      },
      {
        name: 'video_public_read',
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
      maxLength: 200,
      seoRelevant: true,
      description: { tr: 'Video Başlığı', en: 'Video Title' },
      adminOrder: 1,
    },
    {
      name: 'description',
      type: 'textarea',
      localeAware: true,
      required: false,
      maxLength: 500,
      description: { tr: 'Açıklama', en: 'Description' },
      adminOrder: 2,
    },
    {
      name: 'video_url',
      type: 'url',
      localeAware: false,
      required: true,
      maxLength: 400,
      description: { tr: 'Video URL', en: 'Video URL' },
      adminHelp: {
        tr: 'Youtube veya Vimeo URL. Embed otomatik üretilir.',
        en: 'Youtube or Vimeo URL. Embed auto-generated.',
      },
      adminOrder: 3,
    },
    {
      name: 'thumbnail',
      type: 'media_ref',
      localeAware: false,
      required: false,
      description: { tr: 'Kapak Görseli', en: 'Thumbnail' },
      adminHelp: {
        tr: 'Boş bırakılırsa platform\'un default thumbnail\'ı kullanılır.',
        en: 'Empty = platform default thumbnail.',
      },
      adminOrder: 4,
    },
    {
      name: 'duration',
      type: 'text',
      localeAware: false,
      required: false,
      maxLength: 12,
      description: { tr: 'Süre', en: 'Duration' },
      adminHelp: {
        tr: 'Formatted string — örn: "2:45", "10:30", "1:23:45".',
        en: 'Formatted string — e.g. "2:45", "10:30", "1:23:45".',
      },
      adminOrder: 5,
    },
    {
      name: 'is_featured',
      type: 'boolean',
      localeAware: false,
      required: false,
      default: false,
      description: { tr: 'Öne Çıkarılmış', en: 'Featured' },
      adminOrder: 6,
    },
    {
      name: 'sort_order',
      type: 'number',
      localeAware: false,
      required: false,
      default: 0,
      description: { tr: 'Sıralama', en: 'Sort Order' },
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
        { field: 'title', sortable: true, displayLocale: 'current' },
        { field: 'duration', sortable: false, width: '100px', displayLocale: 'current' },
        { field: 'is_featured', sortable: true, width: '100px', displayLocale: 'current' },
        { field: 'sort_order', sortable: true, width: '100px', displayLocale: 'current' },
      ],
      filters: [
        {
          field: 'is_featured',
          type: 'boolean',
          label: { tr: 'Öne Çıkarılmış', en: 'Featured' },
        },
      ],
      searchableFields: ['title'],
      defaultSort: { field: 'sort_order', direction: 'asc' },
      pageSize: 50,
      showLocaleBadges: true,
    },
    detailView: {
      tabs: [
        { id: 'content', label: { tr: 'İçerik', en: 'Content' }, order: 0 },
        { id: 'media', label: { tr: 'Medya', en: 'Media' }, order: 1 },
      ],
      fieldGroups: [
        {
          tabId: 'content',
          title: { tr: 'Video Bilgisi', en: 'Video Info' },
          fields: ['title', 'description', 'video_url', 'duration', 'is_featured', 'sort_order', 'published_at'],
          collapsed: false,
        },
        {
          tabId: 'media',
          title: { tr: 'Kapak', en: 'Thumbnail' },
          fields: ['thumbnail'],
          collapsed: false,
        },
      ],
      previewEnabled: true,
      autoSaveDraft: true,
      showCharCount: true,
    },
    bulkActions: [
      { id: 'publish', label: { tr: 'Yayınla', en: 'Publish' }, icon: 'CheckCircle' },
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
    listPage: null,
    detailPage: null,
    homeSections: [
      {
        variantId: 'video-single',
        displayName: { tr: 'Tek Video (Hero)', en: 'Single Video (Hero)' },
        defaultCount: 1,
        selectionLogic: 'featured',
      },
      {
        variantId: 'video-grid',
        displayName: { tr: 'Video Grid', en: 'Video Grid' },
        defaultCount: 6,
        selectionLogic: 'manual',
      },
      {
        variantId: 'video-featured',
        displayName: { tr: 'Öne Çıkan Video', en: 'Featured Video' },
        defaultCount: 3,
        selectionLogic: 'featured',
      },
    ],
    urlPattern: '',
  },

  content: {
    architectRules: [
      {
        trigger: 'always',
        rule: {
          tr: 'Video URL brief\'te yoksa placeholder Youtube URL ("https://www.youtube.com/watch?v=dQw4w9WgXcQ") kullanmayın — boş bırakın, müşteri panelden ekleyecek.',
          en: 'If brief lacks video URL, DO NOT use placeholder Youtube URL — leave empty, client adds via admin.',
        },
        priority: 10,
      },
      {
        trigger: 'sector:agency',
        rule: {
          tr: 'Ajans video: tanıtım filmi, müşteri hikayesi. 2-4 video önerilir.',
          en: 'Agency videos: promo, customer story. 2-4 videos recommended.',
        },
        priority: 7,
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
      tr: ['title', 'video_url'],
      en: ['title', 'video_url'],
    },
    unique: [],
    businessRules: [],
  },
};
