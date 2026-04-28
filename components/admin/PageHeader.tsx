'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/cn';

// ---------------------------------------------------------------------------
// H6 Sprint 1 Gün 4 — PageHeader (pure presentational)
// Spec: docs/h6-reusable-components.md §5.
// ---------------------------------------------------------------------------

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string | ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  actions?: ReactNode;
  description?: string;
  className?: string;
}

export function PageHeader({
  title,
  breadcrumbs,
  actions,
  description,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn('space-y-2 border-b border-slate-200 pb-4', className)}>
      {breadcrumbs && breadcrumbs.length > 0 ? (
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
            {breadcrumbs.map((item, index) => {
              const isLast = index === breadcrumbs.length - 1;
              return (
                <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
                  {index > 0 ? (
                    <span className="text-slate-400" aria-hidden="true">
                      /
                    </span>
                  ) : null}
                  {item.href && !isLast ? (
                    <Link
                      href={item.href}
                      className="text-slate-500 transition-colors hover:text-slate-900"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <span
                      className={cn(isLast && 'font-medium text-slate-700')}
                      aria-current={isLast ? 'page' : undefined}
                    >
                      {item.label}
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
      ) : null}

      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div className="min-w-0 flex-1">
          {typeof title === 'string' ? (
            <h1 className="truncate text-2xl font-semibold text-slate-900">
              {title}
            </h1>
          ) : (
            title
          )}
          {description ? (
            <p className="mt-1 text-sm text-slate-500">{description}</p>
          ) : null}
        </div>
        {actions ? (
          <div className="flex shrink-0 items-center gap-2">{actions}</div>
        ) : null}
      </div>
    </div>
  );
}
