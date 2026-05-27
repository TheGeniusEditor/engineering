import type { LucideIcon } from "lucide-react";

interface PanelHeaderProps {
  icon: LucideIcon;
  title: string;
  action?: string;
  onAction?: () => void;
}

export default function PanelHeader({ icon: Icon, title, action, onAction }: PanelHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-3 mb-4">
      <div className="flex items-center gap-2.5">
        <Icon size={17} className="text-sky-600 flex-shrink-0" />
        <h2 className="text-sm font-semibold text-slate-800">{title}</h2>
      </div>
      {action && (
        <button
          onClick={onAction}
          className="text-xs text-slate-500 hover:text-slate-700 font-medium transition-colors"
        >
          {action}
        </button>
      )}
    </div>
  );
}
