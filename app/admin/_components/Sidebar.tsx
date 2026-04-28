'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  Award,
  BadgeCheck,
  Bell,
  Box,
  Briefcase,
  Calendar,
  FileText,
  Image as ImageIcon,
  Images,
  Layers,
  LayoutDashboard,
  LifeBuoy,
  Mail,
  Newspaper,
  Package,
  Palette,
  Phone,
  Settings,
  TrendingUp,
  Users,
  Video,
  type LucideIcon,
} from 'lucide-react';
import { ALL_MODULE_SPECS } from '@studio/shared/specs';

interface NavItem {
  label: string;
  href: string;
  icon?: LucideIcon;
  soon?: boolean;
}

// H5 Ayak C Gün 2+3 — Tema + Destek İçerik'ten sonra, Leads'ten önce.
// H6 Sprint 13 — Medya base nav'a eklendi (Tema'dan hemen sonra).
const BASE_NAV: NavItem[] = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'İçerik', href: '/admin/content', icon: FileText },
  { label: 'Tema', href: '/admin/theme', icon: Palette },
  { label: 'Medya', href: '/admin/media', icon: ImageIcon },
];

const SUPPORT_NAV: NavItem[] = [
  { label: 'Destek', href: '/admin/support', icon: LifeBuoy },
  { label: "Lead'ler", href: '/admin/leads', icon: Mail },
];

const APPOINTMENT_NAV: NavItem = {
  label: 'Randevular',
  href: '/admin/appointments',
  icon: BadgeCheck,
};
const SETTINGS_NAV: NavItem = { label: 'Ayarlar', href: '/admin/settings', icon: Settings };

// H6 Sprint 4 — modül icon map. Yeni modül eklendiğinde buraya da eklenir.
const MODULE_ICON_MAP: Record<string, LucideIcon> = {
  Package,
  Briefcase,
  Newspaper,
  Users,
  Award,
  BadgeCheck,
  Images,
  Image: ImageIcon,
  Layers,
  // H6 Sprint 7-8 section modüller
  TrendingUp,
  Bell,
  Mail,
  Calendar,
  Video,
  Phone,
};

function getModuleIcon(name: string | undefined): LucideIcon {
  if (!name) return Box;
  return MODULE_ICON_MAP[name] ?? Box;
}

const PRIORITY_ORDER: Record<string, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
};

export function Sidebar({ showAppointments }: { showAppointments: boolean }) {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const moduleItems: NavItem[] = [...ALL_MODULE_SPECS]
    .sort((a, b) => {
      const pa = PRIORITY_ORDER[a.meta.priority] ?? 99;
      const pb = PRIORITY_ORDER[b.meta.priority] ?? 99;
      if (pa !== pb) return pa - pb;
      return a.meta.id.localeCompare(b.meta.id);
    })
    .map((spec) => ({
      label: spec.meta.displayName.tr ?? spec.meta.id,
      href: `/admin/modules/${spec.meta.id}`,
      icon: getModuleIcon(spec.meta.icon),
    }));

  async function handleLogout() {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch {
      setLoggingOut(false);
    }
  }

  const renderItem = (item: NavItem) => {
    if (item.soon) {
      return (
        <li key={item.href}>
          <div className="flex cursor-not-allowed items-center justify-between rounded px-3 py-2 text-sm text-slate-400">
            <span>{item.label}</span>
            <span className="rounded-full border border-slate-200 px-2 py-0.5 text-[10px] uppercase tracking-wide">
              Yakında
            </span>
          </div>
        </li>
      );
    }
    const active =
      item.href === '/admin'
        ? pathname === '/admin'
        : pathname.startsWith(item.href);
    const Icon = item.icon;
    return (
      <li key={item.href}>
        <Link
          href={item.href}
          aria-current={active ? 'page' : undefined}
          className={`flex items-center gap-2 rounded px-3 py-2 text-sm transition-colors ${
            active ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          {Icon ? <Icon className="h-4 w-4 shrink-0" aria-hidden="true" /> : null}
          <span className="truncate">{item.label}</span>
        </Link>
      </li>
    );
  };

  return (
    <aside className="flex w-[240px] shrink-0 flex-col border-r border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-6 py-5">
        <div className="text-xs uppercase tracking-widest text-slate-500">Admin</div>
        <div className="mt-1 text-base font-semibold text-slate-900">Studio</div>
      </div>

      <nav className="flex-1 overflow-y-auto p-3">
        <ul className="space-y-1">{BASE_NAV.map(renderItem)}</ul>

        {moduleItems.length > 0 ? (
          <div className="mt-6">
            <div
              className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-widest text-slate-400"
              role="heading"
              aria-level={2}
            >
              Modüller
            </div>
            <ul className="space-y-1" data-testid="sidebar-modules">
              {moduleItems.map(renderItem)}
            </ul>
          </div>
        ) : null}

        <div className="mt-6">
          <ul className="space-y-1">
            {SUPPORT_NAV.map(renderItem)}
            {showAppointments ? renderItem(APPOINTMENT_NAV) : null}
            {renderItem(SETTINGS_NAV)}
          </ul>
        </div>
      </nav>

      <div className="border-t border-slate-200 p-3">
        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          className="w-full rounded px-3 py-2 text-left text-sm text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 disabled:opacity-60"
        >
          {loggingOut ? 'Çıkılıyor…' : 'Çıkış'}
        </button>
      </div>
    </aside>
  );
}
