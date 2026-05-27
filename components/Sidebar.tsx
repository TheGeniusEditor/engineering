"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Gauge, LayoutDashboard, Wrench, ListChecks, ShieldCheck,
  Banknote, FileBarChart, Settings2, LifeBuoy, ChevronLeft,
  ChevronRight, HardHat,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { navItems } from "@/lib/data";
import clsx from "clsx";

const iconMap: Record<string, React.ElementType> = {
  dashboard: LayoutDashboard,
  equipment: HardHat,
  maintenance: Wrench,
  workflow: ListChecks,
  approvals: ShieldCheck,
  insights: Banknote,
  reports: FileBarChart,
  settings: Settings2,
};

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const { activeRole } = useStore();

  const visibleNav = navItems.filter((item) => activeRole.nav.includes(item.id));

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/" || pathname.startsWith("/dashboard");
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={clsx(
        "flex flex-col bg-navy-900 border-r border-navy-800 h-full transition-all duration-200 ease-in-out flex-shrink-0",
        collapsed ? "w-[72px]" : "w-[260px]"
      )}
    >
      {/* Brand */}
      <div className={clsx("flex items-center gap-3 px-4 py-5 border-b border-navy-800 min-h-[72px]", collapsed && "justify-center px-0")}>
        <div className="w-9 h-9 rounded-lg bg-sky-500 flex items-center justify-center flex-shrink-0">
          <Gauge size={18} className="text-white" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="text-sm font-bold text-white leading-tight truncate">Hotel Engineering</p>
            <p className="text-xs text-navy-300 leading-tight mt-0.5 truncate">Asset & Maintenance</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 scrollbar-thin">
        <div className="space-y-1">
          {visibleNav.map((item) => {
            const Icon = iconMap[item.id] ?? LayoutDashboard;
            const active = isActive(item.href);
            return (
              <Link
                key={item.id}
                href={item.href}
                title={collapsed ? item.label : undefined}
                className={clsx(
                  "flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
                  collapsed ? "justify-center" : "gap-3",
                  active
                    ? "bg-sky-500/15 text-sky-400 border border-sky-500/20"
                    : "text-navy-300 hover:bg-navy-800 hover:text-white border border-transparent"
                )}
              >
                <Icon size={18} className="flex-shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Collapse Toggle */}
      <div className="px-3 py-2 border-t border-navy-800">
        <button
          onClick={onToggle}
          className={clsx(
            "w-full flex items-center rounded-lg px-3 py-2.5 text-sm font-medium text-navy-400 hover:bg-navy-800 hover:text-white transition-colors duration-150",
            collapsed ? "justify-center" : "gap-3"
          )}
        >
          {collapsed ? <ChevronRight size={18} /> : <><ChevronLeft size={18} /><span>Collapse</span></>}
        </button>
      </div>

      {/* Footer */}
      {!collapsed && (
        <div className="px-4 py-4 border-t border-navy-800">
          <div className="flex items-center gap-3 bg-navy-800 rounded-lg px-3 py-2.5">
            <LifeBuoy size={16} className="text-sky-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">24/7 Escalation</p>
              <p className="text-xs text-navy-400 truncate">Critical assets monitored</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
