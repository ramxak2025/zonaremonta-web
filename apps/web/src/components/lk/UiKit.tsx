import { type LucideIcon } from 'lucide-react';

export function StatCard({
  label, value, hint, accent, icon: Icon,
}: {
  label: string;
  value: string | number;
  hint?: string;
  accent?: 'red' | 'green' | 'blue' | 'yellow';
  icon?: LucideIcon;
}) {
  const accentColor =
    accent === 'red'
      ? '#FF3E4F'
      : accent === 'green'
        ? '#22C55E'
        : accent === 'blue'
          ? '#4A9FD9'
          : accent === 'yellow'
            ? '#FFCC00'
            : '#FFFFFF';
  return (
    <div className="card-strong p-5 md:p-6 flex flex-col justify-between min-h-[128px] gap-4">
      <div className="flex items-start justify-between">
        <span className="text-[10px] uppercase tracking-[0.2em] text-white/55 font-semibold">
          {label}
        </span>
        {Icon && (
          <span className="w-9 h-9 rounded-xl grid place-items-center bg-white/[0.04] border border-white/10">
            <Icon className="w-4 h-4" style={{ color: accentColor }} strokeWidth={2.2} />
          </span>
        )}
      </div>
      <div>
        <div
          className="font-display leading-none tracking-tight"
          style={{
            fontSize: 'clamp(28px, 3vw, 36px)',
            color: accentColor,
          }}
        >
          {value}
        </div>
        {hint && <div className="text-white/55 text-xs mt-1.5">{hint}</div>}
      </div>
    </div>
  );
}

export function StatusBadge({
  status, label,
}: {
  status: 'new' | 'in_progress' | 'done' | 'cancelled' | 'pending';
  label?: string;
}) {
  const map = {
    new: { bg: 'rgba(74,159,217,0.15)', border: 'rgba(74,159,217,0.35)', fg: '#4A9FD9', text: label ?? 'Новый' },
    in_progress: { bg: 'rgba(255,204,0,0.15)', border: 'rgba(255,204,0,0.35)', fg: '#FFCC00', text: label ?? 'В работе' },
    done: { bg: 'rgba(34,197,94,0.15)', border: 'rgba(34,197,94,0.35)', fg: '#22C55E', text: label ?? 'Готово' },
    cancelled: { bg: 'rgba(232,18,36,0.15)', border: 'rgba(232,18,36,0.35)', fg: '#FF3E4F', text: label ?? 'Отменён' },
    pending: { bg: 'rgba(255,255,255,0.05)', border: 'rgba(255,255,255,0.12)', fg: 'rgba(255,255,255,0.75)', text: label ?? 'Ожидание' },
  } as const;
  const s = map[status];
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-widest"
      style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.fg }}
    >
      {s.text}
    </span>
  );
}

export function EmptyState({
  icon: Icon, title, description, cta,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  cta?: React.ReactNode;
}) {
  return (
    <div className="card-strong p-10 md:p-14 flex flex-col items-center justify-center text-center gap-4">
      <span className="w-14 h-14 rounded-2xl grid place-items-center bg-white/[0.04] border border-white/10">
        <Icon className="w-6 h-6 text-white/55" strokeWidth={1.8} />
      </span>
      <div className="flex flex-col gap-1.5">
        <h3 className="h-3 text-white">{title}</h3>
        {description && <p className="text-sm text-white/60 max-w-sm">{description}</p>}
      </div>
      {cta}
    </div>
  );
}

export function TableRoot({ children }: { children: React.ReactNode }) {
  return (
    <div className="card-strong overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">{children}</table>
      </div>
    </div>
  );
}

export function TableHead({ cols }: { cols: readonly string[] }) {
  return (
    <thead>
      <tr className="border-b border-white/5 bg-white/[0.02]">
        {cols.map((c) => (
          <th
            key={c}
            className="text-left px-4 md:px-5 py-3 text-[10px] uppercase tracking-[0.15em] text-white/45 font-semibold whitespace-nowrap"
          >
            {c}
          </th>
        ))}
      </tr>
    </thead>
  );
}

export function Loading() {
  return (
    <div className="card-strong p-10 flex items-center justify-center">
      <div className="flex items-center gap-3 text-white/55 text-sm">
        <span className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white/60 animate-spin" />
        Загрузка…
      </div>
    </div>
  );
}
