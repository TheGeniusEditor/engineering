import clsx from "clsx";

export default function Meter({ value, className }: { value: number; className?: string }) {
  const color =
    value >= 85 ? "bg-emerald-500" : value >= 70 ? "bg-amber-500" : "bg-red-500";
  return (
    <span className={clsx("block h-2 w-full rounded-full bg-slate-100 overflow-hidden", className)}>
      <span
        className={clsx("block h-full rounded-full transition-all duration-300", color)}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </span>
  );
}
