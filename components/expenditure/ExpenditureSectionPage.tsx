"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import PanelHeader from "@/components/ui/PanelHeader";
import EmptyState from "@/components/ui/EmptyState";
import clsx from "clsx";
import {
  Zap,
  Wrench,
  Plus,
  Trash2,
  Pencil,
  Check,
  X,
  IndianRupee,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import type { ExpenditureBill } from "@/lib/types";

const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTHS_LONG = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function getLast6Months(): string[] {
  const out: string[] = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    out.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
  }
  return out;
}

function currentMonth(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function fmtShort(ym: string) {
  return MONTHS_SHORT[Number(ym.split("-")[1]) - 1];
}

function fmtLong(ym: string) {
  const [y, m] = ym.split("-");
  return `${MONTHS_LONG[Number(m) - 1]} ${y}`;
}

function fmtAmt(n: number): string {
  if (n >= 100000) return `₹${(n / 100000).toFixed(n % 100000 === 0 ? 0 : 1)}L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}K`;
  return `₹${n}`;
}

function fmtFull(n: number): string {
  return "₹" + n.toLocaleString("en-IN");
}

function SpendChart({ bills, budget, barColor }: {
  bills: ExpenditureBill[];
  budget: number;
  barColor: string;
}) {
  const months = useMemo(() => getLast6Months(), []);

  const data = useMemo(
    () => months.map((ym) => ({
      ym,
      label: fmtShort(ym),
      actual: bills.filter((b) => b.month === ym).reduce((sum, bill) => sum + bill.amount, 0),
    })),
    [months, bills],
  );

  const maxVal = useMemo(() => {
    const maxActual = Math.max(...data.map((d) => d.actual), 0);
    return Math.max(budget * 1.3, maxActual * 1.1, 1);
  }, [data, budget]);

  const W = 600;
  const H = 210;
  const TOP = 18;
  const BOT = 170;
  const CHART_H = BOT - TOP;
  const COL_W = W / 6;
  const BAR_W = 46;
  const chartId = `spend-${barColor.replace(/[^a-z0-9]/gi, "")}`;

  const toY = (value: number) => BOT - (value / maxVal) * CHART_H;
  const budgetY = toY(budget);

  return (
    <div className="w-full rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-slate-50 p-3 shadow-sm overflow-hidden">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 210 }}>
        <defs>
          <linearGradient id={`${chartId}-bg`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#f8fafc" />
          </linearGradient>
          <linearGradient id={`${chartId}-bar`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={barColor} stopOpacity="1" />
            <stop offset="100%" stopColor={barColor} stopOpacity="0.72" />
          </linearGradient>
          <linearGradient id={`${chartId}-over`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fb7185" />
            <stop offset="100%" stopColor="#fca5a5" />
          </linearGradient>
          <filter id={`${chartId}-glow`} x="-20%" y="-20%" width="140%" height="160%">
            <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor={barColor} floodOpacity="0.18" />
          </filter>
        </defs>

        <rect x={0} y={0} width={W} height={H} rx={18} fill={`url(#${chartId}-bg)`} />

        {[0.25, 0.5, 0.75, 1].map((frac) => {
          const gy = toY(maxVal * frac);
          return (
            <g key={frac}>
              <line x1={0} y1={gy} x2={W} y2={gy} stroke="#e2e8f0" strokeDasharray="4 4" strokeWidth={1} />
              <text x={6} y={gy - 4} fontSize={8} fill="#94a3b8" fontWeight="600">{fmtAmt(maxVal * frac)}</text>
            </g>
          );
        })}

        <line x1={0} y1={budgetY} x2={W} y2={budgetY} stroke="#94a3b8" strokeDasharray="6 4" strokeWidth={1.5} />
        <rect x={W - 102} y={budgetY - 15} width={96} height={18} rx={9} fill="#ffffff" opacity={0.98} />
        <text x={W - 14} y={budgetY - 2} textAnchor="end" fontSize={9} fill="#475569" fontWeight="700">
          Budget {fmtAmt(budget)}
        </text>

        {data.map((d, i) => {
          const barH = Math.max(0, (d.actual / maxVal) * CHART_H);
          const bx = i * COL_W + (COL_W - BAR_W) / 2;
          const by = BOT - barH;
          const over = d.actual > 0 && d.actual > budget;
          const fill = d.actual === 0 ? "#e2e8f0" : over ? `url(#${chartId}-over)` : `url(#${chartId}-bar)`;

          return (
            <g key={d.ym} filter={d.actual > 0 ? `url(#${chartId}-glow)` : undefined}>
              <rect x={bx} y={TOP} width={BAR_W} height={CHART_H} rx={12} fill="#ffffff" stroke="#e2e8f0" />
              {d.actual > 0 && <rect x={bx} y={by} width={BAR_W} height={barH} rx={5} fill={fill} />}
              {d.actual > 0 && (
                <rect
                  x={bx + 8}
                  y={by + 8}
                  width={BAR_W - 16}
                  height={Math.max(8, barH * 0.2)}
                  rx={8}
                  fill="rgba(255,255,255,0.18)"
                />
              )}
              {d.actual > 0 && (
                <text
                  x={bx + BAR_W / 2}
                  y={by - 4}
                  textAnchor="middle"
                  fontSize={9}
                  fontWeight="700"
                  fill={over ? "#ef4444" : "#334155"}
                >
                  {fmtAmt(d.actual)}
                </text>
              )}
              <text x={bx + BAR_W / 2} y={H - 5} textAnchor="middle" fontSize={10} fill="#64748b" fontWeight="600">
                {d.label}
              </text>
              {d.actual > 0 && <circle cx={bx + BAR_W / 2} cy={by + 10} r={2.2} fill="#ffffff" opacity={0.85} />}
            </g>
          );
        })}
      </svg>

      <div className="flex flex-wrap items-center justify-end gap-4 text-xs text-slate-500 mt-2 pr-1">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm inline-block shadow-sm" style={{ background: barColor }} />
          Within budget
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm inline-block bg-gradient-to-b from-rose-400 to-rose-300 shadow-sm" />
          Over budget
        </span>
        <span className="flex items-center gap-1.5">
          <svg width="18" height="10"><line x1="0" y1="5" x2="18" y2="5" stroke="#94a3b8" strokeDasharray="4 2" strokeWidth="1.5" /></svg>
          Monthly budget
        </span>
      </div>
    </div>
  );
}

export default function ExpenditureSectionPage({
  type,
  title,
  barColor,
}: {
  type: "utility" | "repair";
  title: string;
  barColor: string;
}) {
  const router = useRouter();
  const { bills, budgets, addBill, deleteBill, setBudget } = useStore();
  const myBills = bills.filter((bill) => bill.type === type);
  const myBudget = budgets[type];
  const Icon = type === "utility" ? Zap : Wrench;

  const [editBudget, setEditBudget] = useState(false);
  const [budgetInput, setBudgetInput] = useState("");

  const thisMonth = currentMonth();
  const thisSpend = myBills.filter((bill) => bill.month === thisMonth).reduce((sum, bill) => sum + bill.amount, 0);
  const remaining = myBudget - thisSpend;
  const pct = myBudget > 0 ? Math.min(Math.round((thisSpend / myBudget) * 100), 999) : 0;
  const over = thisSpend > myBudget;
  const iconBg = `${barColor}20`;
  const iconColor = barColor;

  const handleSaveBudget = () => {
    const n = parseFloat(budgetInput.replace(/[^0-9.]/g, ""));
    if (n > 0) {
      setBudget(type, n);
      setEditBudget(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="card p-5 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-slate-50 pointer-events-none" />
        <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-sky-100/60 blur-3xl pointer-events-none" />
        <div className="absolute -left-12 bottom-0 w-52 h-52 rounded-full bg-emerald-100/50 blur-3xl pointer-events-none" />

        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3 min-w-0">
            <button className="btn btn-sm self-start" onClick={() => router.push("/insights") }>
              <ArrowLeft size={14} /> Back
            </button>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: iconBg }}>
              <Icon size={20} style={{ color: iconColor }} />
            </div>
            <div>
              <p className="eyebrow">Finance & Engineering</p>
              <h2 className="text-xl font-bold text-slate-900 mt-0.5">{title}</h2>
              <p className="text-sm text-slate-500 mt-1">
                Track monthly spending, manage the budget, and upload supporting bill copies on a dedicated page.
              </p>
            </div>
          </div>

          <Link className="btn btn-primary btn-sm" href={`/insights/${type}/upload`}>
            <Plus size={14} /> Upload Bill
          </Link>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-start gap-4">
            <div className="flex items-start gap-3 flex-1">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: iconBg }}>
                <Icon size={20} style={{ color: iconColor }} />
              </div>
              <div>
                <p className="font-bold text-slate-900">{title} Budget</p>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  {editBudget ? (
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-slate-400">Monthly Budget ₹</span>
                      <input
                        className="input h-7 w-28 text-xs px-2"
                        value={budgetInput}
                        onChange={(e) => setBudgetInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSaveBudget();
                          if (e.key === "Escape") setEditBudget(false);
                        }}
                        autoFocus
                      />
                      <button className="btn btn-sm btn-icon" onClick={handleSaveBudget}><Check size={13} /></button>
                      <button className="btn btn-sm btn-icon" onClick={() => setEditBudget(false)}><X size={13} /></button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-slate-400">Monthly budget:</span>
                      <span className="text-xs font-bold text-slate-700">{fmtFull(myBudget)}</span>
                      <button
                        className="text-slate-300 hover:text-slate-500 transition-colors"
                        onClick={() => { setBudgetInput(String(myBudget)); setEditBudget(true); }}
                      >
                        <Pencil size={11} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-5 flex-shrink-0">
              <div className="text-right">
                <p className="text-xs text-slate-400">Spent this month</p>
                <p className={clsx("text-xl font-bold", over ? "text-red-500" : "text-slate-800")}>{fmtFull(thisSpend)}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400">{over ? "Over by" : "Remaining"}</p>
                <p className={clsx("text-xl font-bold", over ? "text-red-500" : "text-emerald-600")}>{fmtFull(Math.abs(remaining))}</p>
              </div>
              <div className="relative w-14 h-14 flex-shrink-0">
                <svg viewBox="0 0 44 44" className="w-14 h-14 -rotate-90">
                  <circle cx="22" cy="22" r="18" fill="none" stroke="#f1f5f9" strokeWidth="5" />
                  <circle
                    cx="22"
                    cy="22"
                    r="18"
                    fill="none"
                    stroke={over ? "#f87171" : barColor}
                    strokeWidth="5"
                    strokeDasharray={`${Math.min(pct, 100) * 1.131} 113.1`}
                    strokeLinecap="round"
                  />
                </svg>
                <span className={clsx("absolute inset-0 flex items-center justify-center text-xs font-bold", over ? "text-red-500" : "text-slate-700")}>{pct}%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-5 border-b border-slate-100">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-4">
            Monthly Spend vs Budget — Last 6 Months
          </p>
          <SpendChart bills={myBills} budget={myBudget} barColor={barColor} />
        </div>

        <div className="p-5">
          <PanelHeader icon={IndianRupee} title="Uploaded Bills" action={`${myBills.length} entries`} />
          {myBills.length === 0 ? (
            <EmptyState message="No bills uploaded yet. Click 'Upload Bill' to record the first entry." />
          ) : (
            <div className="mt-3 space-y-2 max-h-72 overflow-y-auto scrollbar-thin pr-1">
              {[...myBills]
                .sort((a, b) => b.month.localeCompare(a.month) || b.uploadedAt.localeCompare(a.uploadedAt))
                .map((bill) => (
                  <div
                    key={bill.id}
                    className="flex flex-col gap-3 p-3 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-800 truncate">{bill.description}</p>
                        <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5 flex-wrap">
                          <span>{fmtLong(bill.month)}</span>
                          {bill.reference && <span className="font-mono text-slate-400">{bill.reference}</span>}
                          <span>{bill.uploadedAt}</span>
                        </div>
                      </div>
                      <p className="font-bold text-slate-800 text-sm flex-shrink-0">{fmtFull(bill.amount)}</p>
                      <button className="btn btn-sm btn-icon btn-danger flex-shrink-0" onClick={() => deleteBill(bill.id)}>
                        <Trash2 size={13} />
                      </button>
                    </div>

                    {bill.billCopyDataUrl && (
                      <div className="flex items-center justify-between gap-3 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
                        <div className="flex items-center gap-2 min-w-0 text-xs text-slate-500">
                          <ArrowRight size={14} />
                          <span className="truncate">Bill copy attached</span>
                        </div>
                        <span className="text-xs font-medium text-emerald-700">Ready</span>
                      </div>
                    )}

                    {bill.equipmentIdentity && (
                      <div className="flex items-center justify-between gap-3 rounded-lg border border-slate-100 bg-white px-3 py-2 text-xs">
                        <div className="min-w-0">
                          <p className="text-slate-400">Registry identity</p>
                          <p className="font-semibold text-slate-700 truncate">{bill.equipmentIdentity}</p>
                        </div>
                        {bill.equipmentIdentityType && (
                          <span className="rounded-full bg-slate-100 px-2 py-1 font-medium text-slate-500">
                            {bill.equipmentIdentityType === "qr" ? "QR asset" : "Non-QR item"}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
