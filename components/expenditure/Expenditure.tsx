"use client";

import Link from "next/link";
import { Zap, Wrench, ArrowRight, Receipt } from "lucide-react";

const cards = [
  {
    href: "/insights/utility",
    title: "Utility",
    description: "Electricity, water, diesel, and other utility bills.",
    icon: Zap,
    accent: "#0ea5e9",
  },
  {
    href: "/insights/repair",
    title: "Repair",
    description: "Maintenance repairs, contractor work, and service bills.",
    icon: Wrench,
    accent: "#10b981",
  },
] as const;

export default function Expenditure() {
  return (
    <div className="space-y-6">
      <div className="card p-5">
        <p className="eyebrow">Finance & Engineering</p>
        <h2 className="text-xl font-bold text-slate-900 mt-0.5">Expenditure</h2>
        <p className="text-sm text-slate-500 mt-1">
          Choose utility or repair to upload bills, manage budgets, and attach bill copies for each entry.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cards.map(({ href, title, description, icon: Icon, accent }) => (
          <Link
            key={href}
            href={href}
            className="card p-5 border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all group"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${accent}18` }}>
                  <Icon size={20} style={{ color: accent }} />
                </div>
                <div>
                  <p className="font-bold text-slate-900">{title}</p>
                  <p className="text-sm text-slate-500 mt-1 max-w-sm">{description}</p>
                </div>
              </div>
              <ArrowRight size={18} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
              <Receipt size={14} />
              Open the bill upload page
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
