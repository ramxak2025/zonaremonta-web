'use client';
import { Wrench } from 'lucide-react';
import { AppShell } from '@/components/lk/AppShell';
import { ADMIN_NAV } from '@/components/lk/admin-nav';
import { EmptyState, Loading, StatusBadge, TableHead, TableRoot } from '@/components/lk/UiKit';
import { useApi, useAuth } from '@/lib/auth-client';

interface WorkOrder {
  id: string;
  status: 'NEW' | 'IN_PROGRESS' | 'DONE' | 'CANCELLED';
  totalCost: number | string;
  openedAt: string;
  closedAt: string | null;
  client: { name: string | null; phone: string };
  vehicle: { licensePlate: string };
}

const STATUS_MAP: Record<WorkOrder['status'], 'new' | 'in_progress' | 'done' | 'cancelled'> = {
  NEW: 'new',
  IN_PROGRESS: 'in_progress',
  DONE: 'done',
  CANCELLED: 'cancelled',
};

export default function AdminWorkOrders() {
  const { me, loading: authLoading } = useAuth('DIRECTOR');
  const { data, loading } = useApi<WorkOrder[]>(me ? '/work-orders' : null);

  if (authLoading) {
    return (
      <AppShell nav={ADMIN_NAV} me={me} title="Наряды">
        <Loading />
      </AppShell>
    );
  }

  return (
    <AppShell nav={ADMIN_NAV} me={me} title="Наряды">
      {loading ? (
        <Loading />
      ) : data && data.length > 0 ? (
        <TableRoot>
          <TableHead cols={['Открыт', 'Клиент', 'Телефон', 'Авто', 'Статус', 'Сумма', 'Закрыт']} />
          <tbody>
            {data.map((o) => (
              <tr key={o.id} className="border-b border-white/[0.04]">
                <td className="px-4 md:px-5 py-4 text-white/65 text-[13px]">
                  {new Date(o.openedAt).toLocaleDateString('ru-RU')}
                </td>
                <td className="px-4 md:px-5 py-4 text-white">{o.client.name ?? '—'}</td>
                <td className="px-4 md:px-5 py-4 text-white/80 font-mono text-[13px]">
                  {o.client.phone}
                </td>
                <td className="px-4 md:px-5 py-4 text-white/80 font-mono text-[13px]">
                  {o.vehicle.licensePlate}
                </td>
                <td className="px-4 md:px-5 py-4">
                  <StatusBadge status={STATUS_MAP[o.status]} />
                </td>
                <td className="px-4 md:px-5 py-4 text-white font-semibold whitespace-nowrap">
                  {Number(o.totalCost).toLocaleString('ru-RU')} ₽
                </td>
                <td className="px-4 md:px-5 py-4 text-white/55 text-[13px]">
                  {o.closedAt ? new Date(o.closedAt).toLocaleDateString('ru-RU') : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </TableRoot>
      ) : (
        <EmptyState
          icon={Wrench}
          title="Нарядов нет"
          description="Создавайте наряды из заявок — они появятся здесь."
        />
      )}
    </AppShell>
  );
}
