import clsx from "clsx";

const pillStyles: Record<string, string> = {
  critical: "bg-red-50 text-red-700 border-red-200",
  high: "bg-orange-50 text-orange-700 border-orange-200",
  "at-risk": "bg-red-50 text-red-700 border-red-200",
  attention: "bg-orange-50 text-orange-700 border-orange-200",
  medium: "bg-amber-50 text-amber-700 border-amber-200",
  "due-soon": "bg-amber-50 text-amber-700 border-amber-200",
  waiting: "bg-amber-50 text-amber-700 border-amber-200",
  "awaiting-gm": "bg-amber-50 text-amber-700 border-amber-200",
  "finance-review": "bg-amber-50 text-amber-700 border-amber-200",
  "awaiting-finance": "bg-amber-50 text-amber-700 border-amber-200",
  "supervisor-review": "bg-amber-50 text-amber-700 border-amber-200",
  healthy: "bg-emerald-50 text-emerald-700 border-emerald-200",
  active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  "on-track": "bg-emerald-50 text-emerald-700 border-emerald-200",
  met: "bg-emerald-50 text-emerald-700 border-emerald-200",
  scheduled: "bg-sky-50 text-sky-700 border-sky-200",
  "vendor-scheduled": "bg-sky-50 text-sky-700 border-sky-200",
  "in-progress": "bg-blue-50 text-blue-700 border-blue-200",
  assigned: "bg-blue-50 text-blue-700 border-blue-200",
  completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  expired: "bg-slate-100 text-slate-600 border-slate-200",
  draft: "bg-slate-100 text-slate-600 border-slate-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
  low: "bg-slate-100 text-slate-600 border-slate-200",
};

export default function StatusPill({ text, size = "sm" }: { text: string; size?: "sm" | "xs" }) {
  const key = text.toLowerCase().replaceAll(" ", "-").replaceAll("/", "-");
  const style = pillStyles[key] ?? "bg-slate-100 text-slate-600 border-slate-200";
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full border font-semibold whitespace-nowrap",
        size === "xs" ? "px-1.5 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs",
        style
      )}
    >
      {text}
    </span>
  );
}
