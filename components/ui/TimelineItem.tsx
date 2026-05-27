export default function TimelineItem({ date, title, detail }: { date: string; title: string; detail: string }) {
  return (
    <div className="flex gap-4 py-3 border-b border-slate-100 last:border-0">
      <time className="text-xs font-bold text-sky-600 flex-shrink-0 w-28 pt-0.5 leading-snug">{date}</time>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-slate-800 leading-snug">{title}</p>
        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{detail}</p>
      </div>
    </div>
  );
}
