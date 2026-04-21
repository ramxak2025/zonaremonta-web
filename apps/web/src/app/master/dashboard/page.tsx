'use client';
import { BookOpen, Home, Settings, Wrench } from 'lucide-react';
import { AppShell } from '@/components/lk/AppShell';
import { EmptyState, Loading, StatCard, StatusBadge } from '@/components/lk/UiKit';
import { useApi, useAuth } from '@/lib/auth-client';

const NAV = [
  { href: '/master/dashboard', label: 'Мои наряды', icon: Wrench },
  { href: '/master/appointments', label: 'Расписание', icon: Home },
  { href: '/master/instructions', label: 'Инструкции', icon: BookOpen },
  { href: '/master/profile', label: 'Профиль', icon: Settings },
] as const;

interface WorkOrder {
  id: string;
  status: 'NEW' | 'IN_PROGRESS' | 'DONE' | 'CANCELLED';
  totalCost: number | string;
  openedAt: string;
  comment: string | null;
  client: { name: string | null; phone: string };
  vehicle: {
    licensePlate: string;
    brand?: { name: string };
    model?: { name: string };
  };
}

const STATUS_MAP: Record<WorkOrder['status'], 'new' | 'in_progress' | 'done' | 'cancelled'> = {
  NEW: 'new',
  IN_PROGRESS: 'in_progress',
  DONE: 'done',
  CANCELLED: 'cancelled',
};

export default function MasterDashboard() {
  const { me, loading: authLoading } = useAuth('MASTER');
  const { data: orders, loading } = useApi<WorkOrder[]>(me ? '/work-orders' : null);

  if (authLoading || loading) {
    return (
      <AppShell nav={NAV} me={me} title="Мои наряды">
        <Loading />
      </AppShell>
    );
  }

  const newCount = orders?.filter((o) => o.status === 'NEW').length ?? 0;
  const inProgressCount = orders?.filter((o) => o.status === 'IN_PROGRESS').length ?? 0;
  const doneCount = orders?.filter((o) => o.status === 'DONE').length ?? 0;

  return (
    <AppShell nav={NAV} me={me} title="Мои наряды">
      <div className="grid grid-cols-3 gap-3 md:gap-4 mb-8">
        <StatCard label="Новые" value={newCount} accent="blue" />
        <StatCard label="В работе" value={inProgressCount} accent="yellow" />
        <StatCard label="Закрыто" value={doneCount} accent="green" />
      </div>

      {orders && orders.length > 0 ? (
        <div className="card-strong divide-y divide-white/5 overflow-hidden">
          {orders.map((o) => (
            <div
              key={o.id}
              className="p-5 flex flex-col md:flex-row md:items-center gap-3 md:gap-6"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <StatusBadge status={STATUS_MAP[o.status]} />
                  <span className="text-white/45 text-xs">
                    {new Date(o.openedAt).toLocaleDateString('ru-RU')}
                  </span>
                </div>
                <div className="font-display text-lg text-white leading-tight">
                  {o.vehicle.brand?.name ?? '—'} {o.vehicle.model?.name ?? ''}
                  <span className="text-white/55 text-sm font-normal ml-2">
                    · {o.vehicle.licensePlate}
                  </span>
                </div>
                <div className="text-[13px] text-white/65 mt-1">
                  {o.client.name ?? 'Без имени'} · {o.client.phone}
                </div>
                {o.comment && (
                  <div className="text-[13px] text-white/55 mt-2 line-clamp-1">{o.comment}</div>
                )}
              </div>
              <div className="text-right">
                <div className="font-display text-xl text-white">
                  {Number(o.totalCost).toLocaleString('ru-RU')} ₽
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Wrench}
          title="Нарядов пока нет"
          description="Когда директор назначит наряды — они появятся здесь."
        />
      )}
    </AppShell>
  );
}
