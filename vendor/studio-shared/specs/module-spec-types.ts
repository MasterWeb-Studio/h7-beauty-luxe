import { z } from 'zod';

// ---------------------------------------------------------------------------
// H6 Faz 0 Gün 2 — Module Spec Format
//
// Her modülün (Products, Projects, News, Team, Gallery, vb.) davranışını
// tek dosyada tanımlayan şema. 4 uzman agent (Schema Architect, Admin UI
// Builder, Frontend Renderer, Content Teacher) bu spec'i okuyup modülü
// üretir. Validator agent spec ile üretilen kodu karşılaştırır.
//
// Tip stratejisi:
//   - `.optional()` — default'lı alanlar TS tipinde opsiyonel görünür
//   - SPEC_DEFAULTS — consumer kod default'ları uygulamak için kullanır
//   - Zod `.default()` davranışı z.input nested objelerde tutarsız olduğu
//     için bu yaklaşım seçildi
//
// Multi-language baştan entegre: `LocaleString = Record<locale, string>`
// (jsonb-like). Field'lar `localeAware` flag'i ile işaretlenir.
// ---------------------------------------------------------------------------

// ===========================================================================
// Temel tipler
// ===========================================================================

export const LocaleStringSchema = z.record(z.string(), z.string());
export type LocaleString = z.infer<typeof LocaleStringSchema>;

export type Locale = string;

// ===========================================================================
// FieldType enum
// ===========================================================================

export const FieldTypeSchema = z.enum([
  'text',
  'textarea',
  'richtext',
  'number',
  'boolean',
  'date',
  'datetime',
  'slug',
  'media_ref',
  'media_array',
  'category_ref',
  'string_array',
  'jsonb',
  'enum',
  'url',
  'email',
  'phone',
]);
export type FieldType = z.infer<typeof FieldTypeSchema>;

// ===========================================================================
// FieldDefinition
// ===========================================================================

export const FieldDefinitionSchema = z.object({
  name: z.string().regex(/^[a-z][a-z0-9_]*$/, 'snake_case a-z + digit + underscore'),
  type: FieldTypeSchema,
  localeAware: z.boolean(),
  required: z.boolean(),
  unique: z
    .union([
      z.boolean(),
      z.enum(['per-project', 'per-project-per-locale', 'per-tenant']),
    ])
    .optional(),
  maxLength: z.number().int().positive().optional(),
  minLength: z.number().int().nonnegative().optional(),
  enumValues: z.array(z.string()).optional(),
  validation: z.string().optional(),
  seoRelevant: z.boolean().optional(),
  indexForSearch: z.boolean().optional(),
  default: z.unknown().optional(),
  description: LocaleStringSchema,
  adminOrder: z.number().int().nonnegative(),
  adminHelp: LocaleStringSchema.optional(),
});
export type FieldDefinition = z.infer<typeof FieldDefinitionSchema>;

// ===========================================================================
// Database
// ===========================================================================

export const IndexDefinitionSchema = z.object({
  name: z.string(),
  columns: z.array(z.string()),
  unique: z.boolean().optional(),
  method: z.enum(['btree', 'gin', 'gist']).optional(),
  where: z.string().optional(),
  description: z.string().optional(),
});
export type IndexDefinition = z.infer<typeof IndexDefinitionSchema>;

export const RlsPolicyDefinitionSchema = z.object({
  name: z.string(),
  action: z.enum(['select', 'insert', 'update', 'delete', 'all']),
  using: z.string(),
  withCheck: z.string().optional(),
  description: z.string().optional(),
});
export type RlsPolicyDefinition = z.infer<typeof RlsPolicyDefinitionSchema>;

export const TriggerDefinitionSchema = z.object({
  name: z.string(),
  event: z.enum([
    'before_insert',
    'before_update',
    'after_insert',
    'after_update',
    'after_delete',
  ]),
  functionSql: z.string(),
  description: z.string().optional(),
});
export type TriggerDefinition = z.infer<typeof TriggerDefinitionSchema>;

export const ModuleDatabaseSchema = z.object({
  tableName: z.string().regex(/^module_[a-z_]+$/, 'tableName module_ prefix'),
  indexes: z.array(IndexDefinitionSchema).optional(),
  rlsPolicies: z.array(RlsPolicyDefinitionSchema).optional(),
  triggers: z.array(TriggerDefinitionSchema).optional(),
});
export type ModuleDatabase = z.infer<typeof ModuleDatabaseSchema>;

// ===========================================================================
// Categories
// ===========================================================================

export const CategoryConfigSchema = z.object({
  enabled: z.boolean(),
  hierarchical: z.boolean().optional(),
  maxDepth: z.number().int().min(1).max(6).optional(),
  required: z.boolean().optional(),
  shareWithModules: z.array(z.string()).optional(),
});
export type CategoryConfig = z.infer<typeof CategoryConfigSchema>;

// ===========================================================================
// Admin
// ===========================================================================

export const ColumnDefSchema = z.object({
  field: z.string(),
  width: z.string().optional(),
  sortable: z.boolean().optional(),
  displayLocale: z.enum(['current', 'default', 'first-available']).optional(),
});
export type ColumnDef = z.infer<typeof ColumnDefSchema>;

export const FilterDefSchema = z.object({
  field: z.string(),
  type: z.enum([
    'enum-select',
    'category-tree',
    'date-range',
    'boolean',
    'text-search',
    'number-range',
  ]),
  label: LocaleStringSchema,
  placeholder: LocaleStringSchema.optional(),
});
export type FilterDef = z.infer<typeof FilterDefSchema>;

export const SortOptionDefSchema = z.object({
  id: z.string(),
  field: z.string(),
  direction: z.enum(['asc', 'desc']),
  label: LocaleStringSchema,
});
export type SortOptionDef = z.infer<typeof SortOptionDefSchema>;

export const BulkActionDefSchema = z.object({
  id: z.string(),
  label: LocaleStringSchema,
  icon: z.string().optional(),
  confirm: z.boolean().optional(),
  destructive: z.boolean().optional(),
});
export type BulkActionDef = z.infer<typeof BulkActionDefSchema>;

export const AdminListViewConfigSchema = z.object({
  columns: z.array(ColumnDefSchema).min(1),
  filters: z.array(FilterDefSchema).optional(),
  searchableFields: z.array(z.string()).optional(),
  defaultSort: z.object({
    field: z.string(),
    direction: z.enum(['asc', 'desc']),
  }),
  pageSize: z.number().int().positive().max(200).optional(),
  showLocaleBadges: z.boolean().optional(),
});
export type AdminListViewConfig = z.infer<typeof AdminListViewConfigSchema>;

export const TabDefSchema = z.object({
  id: z.string(),
  label: LocaleStringSchema,
  order: z.number().int().nonnegative(),
});
export type TabDef = z.infer<typeof TabDefSchema>;

export const FieldGroupDefSchema = z.object({
  tabId: z.string(),
  title: LocaleStringSchema,
  description: LocaleStringSchema.optional(),
  fields: z.array(z.string()),
  collapsed: z.boolean().optional(),
});
export type FieldGroupDef = z.infer<typeof FieldGroupDefSchema>;

export const AdminDetailViewConfigSchema = z.object({
  tabs: z.array(TabDefSchema).optional(),
  fieldGroups: z.array(FieldGroupDefSchema).optional(),
  previewEnabled: z.boolean().optional(),
  autoSaveDraft: z.boolean().optional(),
  showCharCount: z.boolean().optional(),
});
export type AdminDetailViewConfig = z.infer<typeof AdminDetailViewConfigSchema>;

export const AdminConfigSchema = z.object({
  listView: AdminListViewConfigSchema,
  detailView: AdminDetailViewConfigSchema,
  bulkActions: z.array(BulkActionDefSchema).optional(),
});
export type AdminConfig = z.infer<typeof AdminConfigSchema>;

// ===========================================================================
// Frontend
// ===========================================================================

export const ListPageConfigSchema = z.object({
  layout: z.enum(['grid', 'list', 'masonry', 'mixed']),
  itemsPerPage: z.number().int().positive().optional(),
  filters: z.array(FilterDefSchema).optional(),
  sortOptions: z.array(SortOptionDefSchema).optional(),
  emptyStateMessage: LocaleStringSchema,
  showPagination: z.boolean().optional(),
});
export type ListPageConfig = z.infer<typeof ListPageConfigSchema>;

export const DetailSectionDefSchema = z.object({
  id: z.string(),
  order: z.number().int().nonnegative(),
  required: z.boolean().optional(),
});
export type DetailSectionDef = z.infer<typeof DetailSectionDefSchema>;

export const DetailPageConfigSchema = z.object({
  layout: z.enum(['article', 'showcase', 'product', 'profile', 'card']),
  sections: z.array(DetailSectionDefSchema).min(1),
  relatedModuleId: z.string().optional(),
  relatedLogic: z.enum(['same-category', 'tags', 'latest', 'manual']).optional(),
  relatedCount: z.number().int().positive().optional(),
});
export type DetailPageConfig = z.infer<typeof DetailPageConfigSchema>;

export const HomeSectionDefSchema = z.object({
  variantId: z.string(),
  displayName: LocaleStringSchema,
  defaultCount: z.number().int().positive().optional(),
  selectionLogic: z.enum(['latest', 'featured', 'random', 'manual', 'bestsellers']),
});
export type HomeSectionDef = z.infer<typeof HomeSectionDefSchema>;

export const FrontendConfigSchema = z.object({
  listPage: ListPageConfigSchema.nullable(),
  detailPage: DetailPageConfigSchema.nullable(),
  homeSections: z.array(HomeSectionDefSchema).optional(),
  urlPattern: z.string(),
});
export type FrontendConfig = z.infer<typeof FrontendConfigSchema>;

// ===========================================================================
// Content
// ===========================================================================

export const ArchitectRuleSchema = z.object({
  trigger: z.string(),
  rule: LocaleStringSchema,
  priority: z.number().int().min(0).max(10).optional(),
});
export type ArchitectRule = z.infer<typeof ArchitectRuleSchema>;

export const SamplePatternSchema = z.object({
  sector: z.string(),
  samples: z.array(z.record(z.string(), z.unknown())),
  count: z.number().int().positive().optional(),
});
export type SamplePattern = z.infer<typeof SamplePatternSchema>;

export const ContentConfigSchema = z.object({
  architectRules: z.array(ArchitectRuleSchema).optional(),
  placeholderStrategy: z.enum(['auto', 'manual', 'none']).optional(),
  samplePatterns: z.array(SamplePatternSchema).optional(),
});
export type ContentConfig = z.infer<typeof ContentConfigSchema>;

// ===========================================================================
// SEO
// ===========================================================================

export const SeoConfigSchema = z.object({
  schemaType: z.string(),
  canonicalPattern: z.string(),
  sitemapIncluded: z.boolean().optional(),
  sitemapPriority: z.number().min(0).max(1).optional(),
  sitemapChangefreq: z
    .enum(['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'])
    .optional(),
  defaultMetaTitle: z.string(),
  defaultMetaDescription: z.string(),
  hreflangEnabled: z.boolean().optional(),
});
export type SeoConfig = z.infer<typeof SeoConfigSchema>;

// ===========================================================================
// Validation
// ===========================================================================

export const UniqueRuleSchema = z.object({
  field: z.string(),
  scope: z.enum(['per-project', 'per-project-per-locale', 'per-tenant', 'per-category']),
  description: z.string().optional(),
});
export type UniqueRule = z.infer<typeof UniqueRuleSchema>;

export const BusinessRuleSchema = z.object({
  id: z.string(),
  expression: z.string(),
  errorMessage: LocaleStringSchema,
});
export type BusinessRule = z.infer<typeof BusinessRuleSchema>;

export const ValidationConfigSchema = z.object({
  required: z.record(z.string(), z.array(z.string())),
  unique: z.array(UniqueRuleSchema).optional(),
  businessRules: z.array(BusinessRuleSchema).optional(),
});
export type ValidationConfig = z.infer<typeof ValidationConfigSchema>;

// ===========================================================================
// Meta
// ===========================================================================

export const ModuleMetaSchema = z.object({
  id: z.string().regex(/^[a-z][a-z0-9-]*$/, 'kebab-case id'),
  /**
   * H6 Sprint 7 — modül tipi.
   * - `list` (default): liste + detay + kategori. Sprint 1-5 modülleri.
   * - `section`: sadece home section öğeleri (Counter, Timeline, Video, Contact cards, Newsletter).
   *   `hasDetailPage: false` + `frontend.listPage: null` + `frontend.detailPage: null`.
   */
  type: z.enum(['list', 'section']).optional(),
  displayName: LocaleStringSchema,
  description: LocaleStringSchema,
  icon: z.string(),
  priority: z.enum(['critical', 'high', 'medium', 'low']),
  hasDetailPage: z.boolean(),
  hasHomeSection: z.boolean(),
  version: z.string().regex(/^\d+\.\d+\.\d+$/, 'semver MAJOR.MINOR.PATCH'),
  since: z.string().optional(),
});
export type ModuleMeta = z.infer<typeof ModuleMetaSchema>;

// ===========================================================================
// ModuleSpec — ana tip
// ===========================================================================

export const ModuleSpecSchema = z.object({
  meta: ModuleMetaSchema,
  database: ModuleDatabaseSchema,
  fields: z.array(FieldDefinitionSchema).min(1),
  categories: CategoryConfigSchema.nullable(),
  admin: AdminConfigSchema,
  frontend: FrontendConfigSchema,
  content: ContentConfigSchema,
  seo: SeoConfigSchema,
  validation: ValidationConfigSchema,
});
export type ModuleSpec = z.infer<typeof ModuleSpecSchema>;

// ===========================================================================
// SPEC_DEFAULTS — consumer kod ve validator agent default'ları buradan okur
// ===========================================================================

export const SPEC_DEFAULTS = {
  indexUnique: false,
  indexMethod: 'btree' as const,
  columnSortable: true,
  columnDisplayLocale: 'current' as const,
  fieldGroupCollapsed: false,
  bulkActionConfirm: false,
  bulkActionDestructive: false,
  detailPreviewEnabled: true,
  detailAutoSaveDraft: true,
  detailShowCharCount: true,
  showLocaleBadges: true,
  listItemsPerPage: 20,
  listPageSize: 50,
  listShowPagination: true,
  homeSectionDefaultCount: 6,
  detailSectionRequired: true,
  detailRelatedCount: 4,
  categoryHierarchical: false,
  categoryMaxDepth: 3,
  categoryRequired: false,
  architectRulePriority: 5,
  samplePatternCount: 3,
  contentPlaceholderStrategy: 'auto' as const,
  seoSitemapIncluded: true,
  seoSitemapPriority: 0.5,
  seoSitemapChangefreq: 'weekly' as const,
  seoHreflangEnabled: true,
};

// ===========================================================================
// Cross-reference doğrulama helper'ı
// ===========================================================================

export interface CrossRefViolation {
  path: string;
  referenced: string;
  reason: string;
}

export function validateSpecCrossRefs(spec: ModuleSpec): CrossRefViolation[] {
  const violations: CrossRefViolation[] = [];
  const fieldNames = new Set(spec.fields.map((f) => f.name));

  // Unique field name
  const seen = new Set<string>();
  for (const f of spec.fields) {
    if (seen.has(f.name)) {
      violations.push({
        path: `fields[name=${f.name}]`,
        referenced: f.name,
        reason: 'Duplicate field name',
      });
    }
    seen.add(f.name);
  }

  // admin.listView.columns
  spec.admin.listView.columns.forEach((c, i) => {
    if (!fieldNames.has(c.field)) {
      violations.push({
        path: `admin.listView.columns[${i}].field`,
        referenced: c.field,
        reason: 'Field spec.fields içinde yok',
      });
    }
  });

  // admin.listView.filters
  (spec.admin.listView.filters ?? []).forEach((f, i) => {
    if (!fieldNames.has(f.field)) {
      violations.push({
        path: `admin.listView.filters[${i}].field`,
        referenced: f.field,
        reason: 'Filter field yok',
      });
    }
  });

  // searchableFields
  (spec.admin.listView.searchableFields ?? []).forEach((name, i) => {
    if (!fieldNames.has(name)) {
      violations.push({
        path: `admin.listView.searchableFields[${i}]`,
        referenced: name,
        reason: 'Searchable field yok',
      });
    }
  });

  // defaultSort
  if (!fieldNames.has(spec.admin.listView.defaultSort.field)) {
    violations.push({
      path: 'admin.listView.defaultSort.field',
      referenced: spec.admin.listView.defaultSort.field,
      reason: 'defaultSort field yok',
    });
  }

  // detailView.fieldGroups
  const tabIds = new Set((spec.admin.detailView.tabs ?? []).map((t) => t.id));
  (spec.admin.detailView.fieldGroups ?? []).forEach((g, gi) => {
    g.fields.forEach((name, fi) => {
      if (!fieldNames.has(name)) {
        violations.push({
          path: `admin.detailView.fieldGroups[${gi}].fields[${fi}]`,
          referenced: name,
          reason: 'Field group alan referansı yok',
        });
      }
    });
    if (tabIds.size > 0 && !tabIds.has(g.tabId)) {
      violations.push({
        path: `admin.detailView.fieldGroups[${gi}].tabId`,
        referenced: g.tabId,
        reason: 'Tab id tanımlı değil',
      });
    }
  });

  // frontend.listPage
  if (spec.frontend.listPage) {
    (spec.frontend.listPage.filters ?? []).forEach((f, i) => {
      if (!fieldNames.has(f.field)) {
        violations.push({
          path: `frontend.listPage.filters[${i}].field`,
          referenced: f.field,
          reason: 'Frontend filter field yok',
        });
      }
    });
    (spec.frontend.listPage.sortOptions ?? []).forEach((s, i) => {
      if (!fieldNames.has(s.field)) {
        violations.push({
          path: `frontend.listPage.sortOptions[${i}].field`,
          referenced: s.field,
          reason: 'Frontend sort field yok',
        });
      }
    });
  }

  // validation.required
  for (const [locale, reqFields] of Object.entries(spec.validation.required)) {
    reqFields.forEach((name, i) => {
      if (!fieldNames.has(name)) {
        violations.push({
          path: `validation.required.${locale}[${i}]`,
          referenced: name,
          reason: 'Required field yok',
        });
      }
    });
  }

  // validation.unique
  (spec.validation.unique ?? []).forEach((u, i) => {
    if (!fieldNames.has(u.field)) {
      violations.push({
        path: `validation.unique[${i}].field`,
        referenced: u.field,
        reason: 'Unique rule field yok',
      });
    }
  });

  // enum field'larda enumValues zorunlu
  spec.fields.forEach((f) => {
    if (f.type === 'enum' && (!f.enumValues || f.enumValues.length === 0)) {
      violations.push({
        path: `fields[name=${f.name}].enumValues`,
        referenced: f.name,
        reason: "type='enum' için enumValues zorunlu",
      });
    }
  });

  return violations;
}
