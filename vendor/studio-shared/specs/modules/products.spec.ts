import type { ModuleSpec } from '../module-spec-types.js';

// ---------------------------------------------------------------------------
// Products module spec — H6 Sprint 1 pilot
//
// En zengin modül: hierarchical kategori, 4 seviyeye kadar, 12 alan,
// bestseller flag, SEO Product schema, 3 home section variant.
// E-ticaret sektöründe kritik; SaaS'ta "plans" olarak yeniden kullanılabilir.
// ---------------------------------------------------------------------------

export const productsSpec: ModuleSpec = {
  meta: {
    id: 'products',
    displayName: { tr: 'Ürünler', en: 'Products' },
    description: {
      tr: 'Ürün kataloğu — kategori bazlı listeleme, detay sayfası, stok durumu',
      en: 'Product catalog — category-based listing, detail page, stock status',
    },
    icon: 'Package',
    priority: 'critical',
    hasDetailPage: true,
    hasHomeSection: true,
    version: '1.0.0',
    since: '2026-04-19',
  },

  database: {
    tableName: 'module_products',
    indexes: [
      {
        name: 'idx_products_project_published',
        columns: ['project_id', 'published_at DESC NULLS LAST'],
        unique: false,
        method: 'btree',
        description: 'Liste sayfası sort by newest',
      },
      {
        name: 'idx_products_category',
        columns: ['category_id'],
        unique: false,
        method: 'btree',
      },
      {
        name: 'idx_products_slug_gin',
        columns: ['slug'],
        unique: false,
        method: 'gin',
        description: 'jsonb slug lookup — her locale için',
      },
      {
        name: 'idx_products_bestseller',
        columns: ['project_id', 'is_bestseller'],
        unique: false,
        method: 'btree',
        where: 'is_bestseller = true',
        description: 'Bestseller home section query',
      },
    ],
    rlsPolicies: [
      {
        name: 'products_service_all',
        action: 'all',
        using: "auth.role() = 'service_role'",
        description: 'Admin API tam erişim (multi-tenant geçişinde aktif edilecek)',
      },
      {
        name: 'products_public_read',
        action: 'select',
        using: 'published_at IS NOT NULL AND published_at <= now()',
        description: 'Public runtime yalnız yayınlanmışları görür',
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
      adminHelp: {
        tr: 'Otomatik oluşur — elle düzenlenebilir. Küçük harf + tire.',
        en: 'Auto-generated — editable. Lowercase + dashes.',
      },
    },
    {
      name: 'name',
      type: 'text',
      localeAware: true,
      required: true,
      maxLength: 200,
      seoRelevant: true,
      indexForSearch: true,
      description: { tr: 'Ürün Adı', en: 'Product Name' },
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
        tr: 'Liste ve kart görünümlerinde kullanılır. 2-3 cümle.',
        en: 'Shown in list and card views. 2-3 sentences.',
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
      name: 'category_id',
      type: 'category_ref',
      localeAware: false,
      required: false,
      description: { tr: 'Kategori', en: 'Category' },
      adminOrder: 5,
    },
    {
      name: 'price',
      type: 'number',
      localeAware: false,
      required: false,
      default: 0,
      description: { tr: 'Fiyat', en: 'Price' },
      adminHelp: {
        tr: 'Numerik değer — para birimi ayrı alanda.',
        en: 'Numeric value — currency in separate field.',
      },
      adminOrder: 6,
    },
    {
      name: 'currency',
      type: 'enum',
      enumValues: ['TRY', 'USD', 'EUR', 'GBP'],
      localeAware: false,
      required: false,
      default: 'TRY',
      description: { tr: 'Para Birimi', en: 'Currency' },
      adminOrder: 7,
    },
    {
      name: 'stock_status',
      type: 'enum',
      enumValues: ['in_stock', 'low_stock', 'out_of_stock', 'pre_order'],
      localeAware: false,
      required: true,
      default: 'in_stock',
      description: { tr: 'Stok Durumu', en: 'Stock Status' },
      adminOrder: 8,
    },
    {
      name: 'is_bestseller',
      type: 'boolean',
      localeAware: false,
      required: false,
      default: false,
      description: { tr: 'Öne Çıkarılmış', en: 'Bestseller' },
      adminOrder: 9,
    },
    {
      name: 'images',
      type: 'media_array',
      localeAware: false,
      required: false,
      description: { tr: 'Görseller', en: 'Images' },
      adminHelp: {
        tr: 'İlk görsel kapak olarak kullanılır. 1-10 arası önerilir.',
        en: 'First image is used as cover. 1-10 recommended.',
      },
      adminOrder: 10,
    },
    {
      name: 'attributes',
      type: 'jsonb',
      localeAware: true,
      required: false,
      description: { tr: 'Özellikler', en: 'Attributes' },
      adminHelp: {
        tr: 'Esnek key-value. Örn: "Renk: Mavi", "Ağırlık: 2kg".',
        en: 'Flexible key-value. E.g. "Color: Blue", "Weight: 2kg".',
      },
      adminOrder: 11,
    },
    {
      name: 'published_at',
      type: 'datetime',
      localeAware: false,
      required: false,
      description: { tr: 'Yayın Tarihi', en: 'Published Date' },
      adminHelp: {
        tr: 'Boş bırakılırsa taslak kalır (public sitede görünmez).',
        en: 'Leave empty to keep as draft (not shown on public site).',
      },
      adminOrder: 12,
    },
  ],

  categories: {
    enabled: true,
    hierarchical: true,
    maxDepth: 4,
    required: false,
  },

  admin: {
    listView: {
      columns: [
        { field: 'name', displayLocale: 'current', sortable: true },
        { field: 'category_id', sortable: false, displayLocale: 'current' },
        { field: 'price', sortable: true, width: '100px', displayLocale: 'current' },
        { field: 'stock_status', sortable: true, width: '120px', displayLocale: 'current' },
        { field: 'is_bestseller', sortable: true, width: '100px', displayLocale: 'current' },
        { field: 'published_at', sortable: true, width: '140px', displayLocale: 'current' },
      ],
      filters: [
        {
          field: 'category_id',
          type: 'category-tree',
          label: { tr: 'Kategori', en: 'Category' },
        },
        {
          field: 'stock_status',
          type: 'enum-select',
          label: { tr: 'Stok', en: 'Stock' },
        },
        {
          field: 'is_bestseller',
          type: 'boolean',
          label: { tr: 'Öne Çıkarılmış', en: 'Bestseller' },
        },
        {
          field: 'published_at',
          type: 'date-range',
          label: { tr: 'Yayın Tarihi', en: 'Published' },
        },
      ],
      searchableFields: ['name', 'short_description'],
      defaultSort: { field: 'published_at', direction: 'desc' },
      pageSize: 50,
      showLocaleBadges: true,
    },
    detailView: {
      tabs: [
        { id: 'content', label: { tr: 'İçerik', en: 'Content' }, order: 0 },
        { id: 'pricing', label: { tr: 'Fiyat & Stok', en: 'Price & Stock' }, order: 1 },
        { id: 'media', label: { tr: 'Medya', en: 'Media' }, order: 2 },
        { id: 'seo', label: { tr: 'SEO', en: 'SEO' }, order: 3 },
        { id: 'publish', label: { tr: 'Yayınla', en: 'Publish' }, order: 4 },
      ],
      fieldGroups: [
        {
          tabId: 'content',
          title: { tr: 'Ürün Bilgileri', en: 'Product Info' },
          fields: ['slug', 'name', 'short_description', 'description', 'attributes'],
          collapsed: false,
        },
        {
          tabId: 'content',
          title: { tr: 'Kategori', en: 'Category' },
          fields: ['category_id'],
          collapsed: false,
        },
        {
          tabId: 'pricing',
          title: { tr: 'Fiyatlandırma', en: 'Pricing' },
          fields: ['price', 'currency', 'stock_status', 'is_bestseller'],
          collapsed: false,
        },
        {
          tabId: 'media',
          title: { tr: 'Görseller', en: 'Images' },
          fields: ['images'],
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
      {
        id: 'publish',
        label: { tr: 'Yayınla', en: 'Publish' },
        icon: 'CheckCircle',
      },
      {
        id: 'unpublish',
        label: { tr: 'Taslağa Al', en: 'Unpublish' },
        icon: 'Archive',
      },
      {
        id: 'move-category',
        label: { tr: 'Kategori Değiştir', en: 'Change Category' },
        icon: 'FolderTree',
      },
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
      filters: [
        {
          field: 'category_id',
          type: 'category-tree',
          label: { tr: 'Kategori', en: 'Category' },
        },
        {
          field: 'price',
          type: 'number-range',
          label: { tr: 'Fiyat Aralığı', en: 'Price Range' },
        },
        {
          field: 'stock_status',
          type: 'enum-select',
          label: { tr: 'Stok', en: 'Availability' },
        },
      ],
      sortOptions: [
        {
          id: 'newest',
          field: 'published_at',
          direction: 'desc',
          label: { tr: 'En Yeni', en: 'Newest' },
        },
        {
          id: 'price-asc',
          field: 'price',
          direction: 'asc',
          label: { tr: 'Fiyat: Artan', en: 'Price: Low to High' },
        },
        {
          id: 'price-desc',
          field: 'price',
          direction: 'desc',
          label: { tr: 'Fiyat: Azalan', en: 'Price: High to Low' },
        },
        {
          id: 'bestseller',
          field: 'is_bestseller',
          direction: 'desc',
          label: { tr: 'Öne Çıkanlar', en: 'Bestsellers' },
        },
      ],
      emptyStateMessage: {
        tr: 'Bu kategoride henüz ürün yok.',
        en: 'No products in this category yet.',
      },
      showPagination: true,
    },
    detailPage: {
      layout: 'product',
      sections: [
        { id: 'gallery', order: 0, required: true },
        { id: 'title', order: 1, required: true },
        { id: 'price', order: 2, required: false },
        { id: 'short_description', order: 3, required: false },
        { id: 'attributes', order: 4, required: false },
        { id: 'description', order: 5, required: false },
        { id: 'stock_cta', order: 6, required: true },
        { id: 'related', order: 7, required: false },
      ],
      relatedModuleId: 'products',
      relatedLogic: 'same-category',
      relatedCount: 4,
    },
    homeSections: [
      {
        variantId: 'product-grid-3col',
        displayName: {
          tr: 'Ürün Grid (3 Sütun)',
          en: 'Product Grid (3 Cols)',
        },
        defaultCount: 6,
        selectionLogic: 'latest',
      },
      {
        variantId: 'product-featured',
        displayName: {
          tr: 'Öne Çıkan Ürünler',
          en: 'Featured Products',
        },
        defaultCount: 4,
        selectionLogic: 'bestsellers',
      },
      {
        variantId: 'product-carousel',
        displayName: {
          tr: 'Ürün Carousel',
          en: 'Product Carousel',
        },
        defaultCount: 8,
        selectionLogic: 'latest',
      },
    ],
    urlPattern: '/products/[...slug]',
  },

  content: {
    architectRules: [
      {
        trigger: 'sector:ecommerce',
        rule: {
          tr: 'Ürün listesi zengin olmalı: 12-24 ürün önerir, 3-5 kategori.',
          en: 'Product list should be rich: 12-24 products, 3-5 categories.',
        },
        priority: 8,
      },
      {
        trigger: 'sector:saas',
        rule: {
          tr: 'Ürün yerine "plan" olarak konumlandır — "Starter / Pro / Enterprise" stili.',
          en: 'Position as "plans" — "Starter / Pro / Enterprise" style.',
        },
        priority: 7,
      },
      {
        trigger: 'sector:beauty',
        rule: {
          tr: 'Ürün yerine "hizmet" de olabilir (manikür, cilt bakımı). Fiyat açık.',
          en: 'Services can be used instead of products (manicure, skincare). Price visible.',
        },
        priority: 6,
      },
      {
        trigger: 'always',
        rule: {
          tr: 'Rakamsal iddia yasağı — fiyatlar brief\'te yoksa müşteri panelden girer.',
          en: 'No numerical claims — prices entered by client via admin if not in brief.',
        },
        priority: 10,
      },
    ],
    placeholderStrategy: 'auto',
    samplePatterns: [
      {
        sector: 'ecommerce',
        count: 3,
        samples: [
          {
            name: { tr: 'Örnek Ürün 1', en: 'Sample Product 1' },
            short_description: { tr: 'Müşterinin güncelleyeceği demo içerik', en: 'Demo content to be updated by client' },
            price: 0,
            stock_status: 'in_stock',
          },
        ],
      },
    ],
  },

  seo: {
    schemaType: 'Product',
    canonicalPattern: '/products/{category_path}/{slug}',
    sitemapIncluded: true,
    sitemapPriority: 0.8,
    sitemapChangefreq: 'weekly',
    defaultMetaTitle: '{name} | {siteName}',
    defaultMetaDescription: '{short_description}',
    hreflangEnabled: true,
  },

  validation: {
    required: {
      tr: ['slug', 'name', 'stock_status'],
      en: ['slug', 'name', 'stock_status'],
    },
    unique: [
      {
        field: 'slug',
        scope: 'per-project-per-locale',
        description: 'Aynı proje + locale içinde slug benzersiz',
      },
    ],
    businessRules: [
      {
        id: 'price-non-negative',
        expression: 'price >= 0',
        errorMessage: {
          tr: 'Fiyat negatif olamaz',
          en: 'Price cannot be negative',
        },
      },
    ],
  },
};
