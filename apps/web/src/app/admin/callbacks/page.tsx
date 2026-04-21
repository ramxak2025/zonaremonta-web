'use client';
import { useState } from 'react';
import { PhoneCall } from 'lucide-react';
import { AppShell } from '@/components/lk/AppShell';
import { ADMIN_NAV } from '@/components/lk/admin-nav';
import { EmptyState, Loading, StatusBadge, TableHead, TableRoot } from '@/components/lk/UiKit';
import { apiMutate, useApi, useAuth } from '@/lib/auth-client';

type CallbackStatus = 'NEW' | 'IN_PROGRESS' | 'DONE' | 'SPAM';
const STATUS_MAP: Record<CallbackStatus, 'new' | 'in_progress' | 'done' | 'cancelled'> = {
  NEW: 'new',
  IN_PROGRESS: 'in_progress',
  DONE: 'done',
  SPAM: 'cancelled',
};

interface CallbackRow {
  id: string;
  name: string | null;
  phone: string;
  status: CallbackStatus;
  note: string | null;
  createdAt: string;
}

const FILTERS: Array<{ key: CallbackStatus | 'ALL'; label: string }> = [
  { key: 'ALL', label: 'Все' },
  { key: 'NEW', label: 'Новые' },
  { key: 'IN_PROGRESS', label: 'В работе' },
  { key: 'DONE', label: 'Закрыто' },
  { key: 'SPAM', label: 'Спам' },
];

export default function AdminCallbacks() {
  const { me, loading: authLoading } = useAuth('DIRECTOR');
  const [filter, setFilter] = useState<CallbackStatus | 'ALL'>('ALL');
  const path = filter === 'ALL' ? '/callback' : `/callback?status=${filter}`;
  const { data, loading, refetch } = useApi<CallbackRow[]>(me ? path : null);

  async function setStatus(id: string, status: CallbackStatus) {
    try {
      await apiMutate(`/callback/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      refetch();
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Ошибка');
    }
  }

  if (authLoading) {
    return (
      <AppShell nav={ADMIN_NAV} me={me} title="Заявки">
        <Loading />
      </AppShell>
    );
  }

  return (
    <AppShell nav={ADMIN_NAV} me={me} title="Заявки обратного звонка">
      <div className="flex flex-wrap gap-2 mb-5">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setFilter(f.key)}
            className={`px-4 h-10 rounded-full text-[13px] font-semibold transition-colors ${
              filter === f.key
                ? 'bg-primary/20 border border-primary/40 text-white'
                : 'bg-white/[0.04] border border-white/10 text-white/65 hover:text-white'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <Loading />
      ) : data && data.length > 0 ? (
        <TableRoot>
          <TableHead cols={['Дата', 'Имя', 'Телефон', 'Статус', 'Действия']} />
          <tbody>
            {data.map((c) => (
              <tr key={c.id} className="border-b border-white/[0.04]">
                <td className="px-4 md:px-5 py-4 text-white/65 text-[13px] whitespace-nowrap">
                  {new Date(c.createdAt).toLocaleString('ru-RU', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </td>
                <td className="px-4 md:px-5 py-4 text-white">{c.name ?? '—'}</td>
                <td className="px-4 md:px-5 py-4 text-white/80 font-mono text-[13px]">
                  <a href={`tel:${c.phone}`} className="hover:text-[#FF3E4F]">
                    {c.phone}
                  </a>
                </td>
                <td className="px-4 md:px-5 py-4">
                  <StatusBadge status={STATUS_MAP[c.status]} />
                </td>
                <td className="px-4 md:px-5 py-4">
                  <div className="flex flex-wrap gap-1.5">
                    {c.status !== 'IN_PROGRESS' && (
                      <button
                        type="button"
                        onClick={() => setStatus(c.id, 'IN_PROGRESS')}
                        className="text-[11px] px-2.5 py-1 rounded-full bg-[#FFCC00]/15 border border-[#FFCC00]/35 text-[#FFCC00] font-semibold"
                      >
                        В работу
                      </button>
                    )}
                    {c.status !== 'DONE' && (
                      <button
                        type="button"
                        onClick={() => setStatus(c.id, 'DONE')}
                        className="text-[11px] px-2.5 py-1 rounded-full bg-[#22C55E]/15 border border-[#22C55E]/35 text-[#22C55E] font-semibold"
                      >
                        Закрыть
                      </button>
                    )}
                    {c.status !== 'SPAM' && (
                      <button
                        type="button"
                        onClick={() => setStatus(c.id, 'SPAM')}
                        className="text-[11px] px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/10 text-white/60 font-semibold"
                      >
                        Спам
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </TableRoot>
      ) : (
        <EmptyState
          icon={PhoneCall}
          title="Заявок нет"
          description="Заявки с формы обратного звонка появятся здесь."
        />
      )}
    </AppShell>
  );
}
