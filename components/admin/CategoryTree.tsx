'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  closestCenter,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/lib/cn';

// ---------------------------------------------------------------------------
// H6 Sprint 1 Gün 4-5 — CategoryTree
//
// Picker ve manage mode. @dnd-kit ile recursive sortable tree + ARIA tree.
// Spec: docs/h6-reusable-components.md §4.
// ---------------------------------------------------------------------------

export type LocaleString = Record<string, string>;

export interface Category {
  id: string;
  parent_id: string | null;
  slug: LocaleString;
  name: LocaleString;
  description?: LocaleString;
  sort_order: number;
  children?: Category[];
}

interface CategoryTreeProps {
  categories: Category[];
  locale: string;
  mode: 'picker' | 'manage';
  maxDepth?: number;
  value?: string | null;
  onChange?: (id: string | null) => void;
  onCreate?: (parentId: string | null, name: LocaleString) => Promise<void> | void;
  onUpdate?: (id: string, patch: Partial<Category>) => Promise<void> | void;
  onDelete?: (id: string) => Promise<void> | void;
  onReorder?: (orderedIds: string[], parentId: string | null) => Promise<void> | void;
  emptyLabel?: string;
}

// ---------------------------------------------------------------------------
// Tree build — düz liste → nested children
// ---------------------------------------------------------------------------

export function buildTree(flat: Category[]): Category[] {
  const map = new Map<string, Category>();
  const roots: Category[] = [];
  flat.forEach((c) => map.set(c.id, { ...c, children: [] }));
  map.forEach((c) => {
    if (c.parent_id && map.has(c.parent_id)) {
      map.get(c.parent_id)!.children!.push(c);
    } else {
      roots.push(c);
    }
  });
  const sort = (list: Category[]) => {
    list.sort((a, b) => a.sort_order - b.sort_order);
    list.forEach((c) => c.children && sort(c.children));
  };
  sort(roots);
  return roots;
}

function computeDepth(categories: Category[], depth = 1): number {
  if (categories.length === 0) return depth - 1;
  return Math.max(
    ...categories.map((c) =>
      c.children && c.children.length > 0 ? computeDepth(c.children, depth + 1) : depth
    )
  );
}

// ---------------------------------------------------------------------------

export function CategoryTree({
  categories,
  locale,
  mode,
  maxDepth = 3,
  value = null,
  onChange,
  onCreate,
  onUpdate,
  onDelete,
  onReorder,
  emptyLabel,
}: CategoryTreeProps) {
  const tree = useMemo(() => {
    const looksNested = categories.some((c) => c.children && c.children.length > 0);
    return looksNested ? categories : buildTree(categories);
  }, [categories]);

  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => {
    const set = new Set<string>();
    tree.forEach((c) => set.add(c.id));
    return set;
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftName, setDraftName] = useState('');
  const [newAt, setNewAt] = useState<{ parentId: string | null; open: boolean }>({
    parentId: null,
    open: false,
  });

  const toggleExpand = useCallback((id: string) => {
    setExpandedIds((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const select = useCallback(
    (id: string) => {
      if (mode !== 'picker') return;
      onChange?.(value === id ? null : id);
    },
    [mode, onChange, value]
  );

  const handleStartEdit = useCallback((cat: Category) => {
    setEditingId(cat.id);
    setDraftName(cat.name[locale] ?? '');
  }, [locale]);

  const handleSaveEdit = useCallback(
    (cat: Category) => {
      const name = draftName.trim();
      if (!name) return setEditingId(null);
      onUpdate?.(cat.id, {
        name: { ...cat.name, [locale]: name },
      });
      setEditingId(null);
    },
    [draftName, locale, onUpdate]
  );

  const handleDelete = useCallback(
    (cat: Category) => {
      const has = cat.children && cat.children.length > 0;
      const msg = has
        ? `"${cat.name[locale]}" ve ${cat.children!.length} alt kategori silinecek. Onaylıyor musunuz?`
        : `"${cat.name[locale]}" silinsin mi?`;
      if (typeof window !== 'undefined' && !window.confirm(msg)) return;
      onDelete?.(cat.id);
    },
    [locale, onDelete]
  );

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent, parentId: string | null, ids: string[]) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;
      const oldIndex = ids.indexOf(String(active.id));
      const newIndex = ids.indexOf(String(over.id));
      if (oldIndex < 0 || newIndex < 0) return;
      const next = arrayMove(ids, oldIndex, newIndex);
      onReorder?.(next, parentId);
    },
    [onReorder]
  );

  if (tree.length === 0 && mode === 'manage' && !newAt.open) {
    return (
      <div className="rounded-md border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
        <p className="text-sm text-slate-500">
          {emptyLabel ?? 'Henüz kategori yok.'}
        </p>
        <button
          type="button"
          onClick={() => setNewAt({ parentId: null, open: true })}
          className="mt-3 inline-flex items-center justify-center rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition-colors hover:bg-slate-800"
        >
          + Yeni kök kategori
        </button>
      </div>
    );
  }

  if (tree.length === 0 && mode === 'picker') {
    return (
      <p className="text-sm text-slate-500">
        {emptyLabel ?? 'Kategori yok. Önce manage sayfasından ekle.'}
      </p>
    );
  }

  return (
    <div className="space-y-2">
      <ul role="tree" className="space-y-0.5">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={(e) =>
            handleDragEnd(e, null, tree.map((c) => c.id))
          }
        >
          <SortableContext
            items={tree.map((c) => c.id)}
            strategy={verticalListSortingStrategy}
          >
            {tree.map((cat) => (
              <CategoryNode
                key={cat.id}
                category={cat}
                depth={1}
                maxDepth={maxDepth}
                locale={locale}
                mode={mode}
                expandedIds={expandedIds}
                toggleExpand={toggleExpand}
                selectedId={value}
                onSelect={select}
                editingId={editingId}
                draftName={draftName}
                setDraftName={setDraftName}
                onStartEdit={handleStartEdit}
                onSaveEdit={handleSaveEdit}
                onDelete={handleDelete}
                onStartNew={(parentId) => setNewAt({ parentId, open: true })}
                onReorder={onReorder}
                sensors={sensors}
              />
            ))}
          </SortableContext>
        </DndContext>
      </ul>

      {mode === 'manage' && newAt.open ? (
        <NewInline
          onCancel={() => setNewAt({ parentId: null, open: false })}
          onConfirm={(name) => {
            onCreate?.(newAt.parentId, { [locale]: name });
            setNewAt({ parentId: null, open: false });
          }}
        />
      ) : null}

      {mode === 'manage' && tree.length > 0 && !newAt.open ? (
        <button
          type="button"
          onClick={() => setNewAt({ parentId: null, open: true })}
          className="inline-flex items-center justify-center rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
        >
          + Yeni kök kategori
        </button>
      ) : null}
    </div>
  );
}

// ---------------------------------------------------------------------------
// CategoryNode — recursive row
// ---------------------------------------------------------------------------

interface NodeProps {
  category: Category;
  depth: number;
  maxDepth: number;
  locale: string;
  mode: 'picker' | 'manage';
  expandedIds: Set<string>;
  toggleExpand: (id: string) => void;
  selectedId: string | null;
  onSelect: (id: string) => void;
  editingId: string | null;
  draftName: string;
  setDraftName: (v: string) => void;
  onStartEdit: (cat: Category) => void;
  onSaveEdit: (cat: Category) => void;
  onDelete: (cat: Category) => void;
  onStartNew: (parentId: string) => void;
  onReorder?: (orderedIds: string[], parentId: string | null) => Promise<void> | void;
  sensors: ReturnType<typeof useSensors>;
}

function CategoryNode(props: NodeProps) {
  const {
    category,
    depth,
    maxDepth,
    locale,
    mode,
    expandedIds,
    toggleExpand,
    selectedId,
    onSelect,
    editingId,
    draftName,
    setDraftName,
    onStartEdit,
    onSaveEdit,
    onDelete,
    onStartNew,
    onReorder,
    sensors,
  } = props;

  const hasChildren = !!category.children && category.children.length > 0;
  const expanded = expandedIds.has(category.id);
  const isEditing = editingId === category.id;
  const canAddChild = depth < maxDepth;
  const name = category.name[locale] || category.name.tr || Object.values(category.name)[0] || '(isimsiz)';

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category.id, disabled: mode !== 'manage' });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLLIElement>) => {
    if (e.key === 'ArrowRight' && hasChildren && !expanded) {
      e.preventDefault();
      toggleExpand(category.id);
    } else if (e.key === 'ArrowLeft' && hasChildren && expanded) {
      e.preventDefault();
      toggleExpand(category.id);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (mode === 'picker') onSelect(category.id);
      else onStartEdit(category);
    } else if (e.key === 'F2' && mode === 'manage') {
      e.preventDefault();
      onStartEdit(category);
    } else if (e.key === 'Delete' && mode === 'manage') {
      e.preventDefault();
      onDelete(category);
    }
  };

  return (
    <li
      ref={setNodeRef}
      role="treeitem"
      aria-level={depth}
      aria-expanded={hasChildren ? expanded : undefined}
      aria-selected={mode === 'picker' ? selectedId === category.id : undefined}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className={cn(
        'rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
        isDragging && 'opacity-50'
      )}
      style={style}
    >
      <div
        className={cn(
          'group flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm transition-colors',
          'hover:bg-slate-50',
          mode === 'picker' && selectedId === category.id && 'bg-blue-50 text-blue-900'
        )}
        style={{ paddingLeft: `${(depth - 1) * 24 + 8}px` }}
      >
        {hasChildren ? (
          <button
            type="button"
            onClick={() => toggleExpand(category.id)}
            className="flex h-5 w-5 items-center justify-center text-slate-400 hover:text-slate-700"
            aria-label={expanded ? 'Kapat' : 'Aç'}
          >
            <span className={cn('transition-transform', expanded && 'rotate-90')}>
              ▸
            </span>
          </button>
        ) : (
          <span className="inline-block w-5" aria-hidden="true" />
        )}

        {mode === 'manage' ? (
          <button
            type="button"
            {...attributes}
            {...listeners}
            className="cursor-grab text-slate-400 hover:text-slate-700 active:cursor-grabbing"
            aria-label="Sürükle"
          >
            ⠿
          </button>
        ) : null}

        {isEditing ? (
          <input
            aria-label="Kategori adı"
            autoFocus
            value={draftName}
            onChange={(e) => setDraftName(e.target.value)}
            onBlur={() => onSaveEdit(category)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onSaveEdit(category);
              if (e.key === 'Escape') {
                e.stopPropagation();
                setDraftName('');
                onSaveEdit({ ...category, name: { ...category.name, [locale]: '' } });
              }
            }}
            className="h-7 flex-1 rounded border border-slate-300 px-2 text-sm outline-none focus:border-blue-500"
          />
        ) : (
          <button
            type="button"
            onClick={() => (mode === 'picker' ? onSelect(category.id) : undefined)}
            className={cn(
              'flex-1 truncate text-left',
              mode === 'picker' && 'cursor-pointer'
            )}
          >
            {name}
          </button>
        )}

        {mode === 'manage' && !isEditing ? (
          <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <ActionButton
              label="Düzenle"
              onClick={() => onStartEdit(category)}
              icon="✎"
            />
            {canAddChild ? (
              <ActionButton
                label="Alt ekle"
                onClick={() => {
                  if (!expanded) toggleExpand(category.id);
                  onStartNew(category.id);
                }}
                icon="+"
              />
            ) : (
              <ActionButton
                label={`Maks. derinlik ${maxDepth}`}
                onClick={() => undefined}
                icon="+"
                disabled
              />
            )}
            <ActionButton
              label="Sil"
              onClick={() => onDelete(category)}
              icon="✕"
            />
          </div>
        ) : null}
      </div>

      {hasChildren && expanded ? (
        <ul role="group" className="space-y-0.5">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={(e) => {
              const { active, over } = e;
              if (!over || active.id === over.id || !onReorder) return;
              const ids = category.children!.map((c) => c.id);
              const oldIndex = ids.indexOf(String(active.id));
              const newIndex = ids.indexOf(String(over.id));
              if (oldIndex < 0 || newIndex < 0) return;
              onReorder(arrayMove(ids, oldIndex, newIndex), category.id);
            }}
          >
            <SortableContext
              items={category.children!.map((c) => c.id)}
              strategy={verticalListSortingStrategy}
            >
              {category.children!.map((child) => (
                <CategoryNode
                  key={child.id}
                  {...props}
                  category={child}
                  depth={depth + 1}
                />
              ))}
            </SortableContext>
          </DndContext>
        </ul>
      ) : null}
    </li>
  );
}

function ActionButton({
  label,
  onClick,
  icon,
  disabled,
}: {
  label: string;
  onClick: () => void;
  icon: ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={cn(
        'flex h-6 w-6 items-center justify-center rounded text-xs text-slate-500',
        'hover:bg-slate-100 hover:text-slate-900',
        'disabled:cursor-not-allowed disabled:opacity-50'
      )}
    >
      {icon}
    </button>
  );
}

function NewInline({
  onCancel,
  onConfirm,
}: {
  onCancel: () => void;
  onConfirm: (name: string) => void;
}) {
  const [name, setName] = useState('');
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    ref.current?.focus();
  }, []);
  return (
    <div className="flex items-center gap-2 rounded-md border border-blue-200 bg-blue-50/50 px-2 py-1.5">
      <input
        aria-label="Yeni kategori adı"
        ref={ref}
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && name.trim()) onConfirm(name.trim());
          if (e.key === 'Escape') onCancel();
        }}
        placeholder="Kategori adı…"
        className="h-7 flex-1 rounded border border-slate-300 bg-white px-2 text-sm outline-none focus:border-blue-500"
      />
      <button
        type="button"
        onClick={() => name.trim() && onConfirm(name.trim())}
        className="rounded bg-slate-900 px-2 py-1 text-xs font-medium text-white hover:bg-slate-800"
      >
        Ekle
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="rounded border border-slate-300 bg-white px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
      >
        İptal
      </button>
    </div>
  );
}
