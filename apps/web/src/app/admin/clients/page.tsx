'use client';
import { useState } from 'react';
import { Search, Users } from 'lucide-react';
import { AppShell } from '@/components/lk/AppShell';
import { ADMIN_NAV } from '@/components/lk/admin-nav';
import { EmptyState, Loading, TableHead, TableRoot } from '@/components/lk/UiKit';
import { useApi, useAuth } from '@/lib/auth-client';

interface Client {
  id: string;
  phone: string;
  name: string | null;
  createdAt: string;
  vehicles: Array<{ id: string; licensePlate: string; hasGbo: boolean }>;
  _count: { workOrders: number };
}

interface Response {
  items: Client[];
  total: number;
}

export default function AdminClients() {
  const { me, loading: authLoading } = useAuth('DIRECTOR');
  const [q, setQ] = useState('');
  const [query, setQuery] = useState('');
  const { data, loading } = useApi<Response>(me ? `/clients?q=${encodeURIComponent(query)}` : null);

  if (authLoading) {
    return (
      <AppShell nav={ADMIN_NAV} me={me} title="Клиенты">
        <Loading />
      </AppShell>
    );
  }

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    setQuery(q);
  }

  return (
    <AppShell nav={ADMIN_NAV} me={me} title="Клиенты">
      <form onSubmit={submitSearch} className="mb-5 flex items-center gap-2">
        <div
          className="flex items-center gap-3 h-12 pl-4 pr-2 rounded-full flex-1"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <Search className="w-4 h-4 text-white/55 flex-none" />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Поиск по телефону или имени"
            className="flex-1 h-full bg-transparent text-white placeholder:text-white/35 outline-none text-sm"
          />
          <button type="submit" className="btn btn-primary !h-9 !px-4 !text-[12px]">
            Найти
          </button>
        </div>
        <div className="text-[13px] text-white/55 whitespace-nowrap hidden md:block">
          Всего: <span className="text-white font-semibold">{data?.total ?? 0}</span>
        </div>
      </form>

      {loading ? (
        <Loading />
      ) : data?.items && data.items.length > 0 ? (
        <TableRoot>
          <TableHead cols={['Клиент', 'Телефон', 'Авто', 'Наряды', 'С нами с']} />
          <tbody>
            {data.items.map((c) => (
              <tr
                key={c.id}
                className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors"
              >
                <td className="px-4 md:px-5 py-4">
                  <div className="text-white font-medium">{c.name ?? '—'}</div>
                </td>
                <td className="px-4 md:px-5 py-4 text-white/80 font-mono text-[13px]">
                  <a href={`tel:${c.phone}`} className="hover:text-[#FF3E4F]">
                    {c.phone}
                  </a>
                </td>
                <td className="px-4 md:px-5 py-4">
                  <div className="flex flex-wrap gap-1.5">
                    {c.vehicles.length === 0 ? (
                      <span className="text-white/40 text-[13px]">—</span>
                    ) : (
                      c.vehicles.slice(0, 2).map((v) => (
                        <span
                          key={v.id}
                          className="text-[11px] px-2 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] font-mono text-white/80"
                        >
                          {v.licensePlate}
                          {v.hasGbo && <span className="ml-1 text-[#22C55E]">●</span>}
                        </span>
                      ))
                    )}
                    {c.vehicles.length > 2 && (
                      <span className="text-[11px] text-white/45">
                        +{c.vehicles.length - 2}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 md:px-5 py-4 text-white/80 text-sm">
                  {c._count.workOrders}
                </td>
                <td className="px-4 md:px-5 py-4 text-white/55 text-[13px]">
                  {new Date(c.createdAt).toLocaleDateString('ru-RU')}
                </td>
              </tr>
            ))}
          </tbody>
        </TableRoot>
      ) : (
        <EmptyState
          icon={Users}
          title="Клиенты не найдены"
          description={query ? `По запросу «${query}» ничего не найдено.` : 'В базе пока нет клиентов.'}
        />
      )}
    </AppShell>
  );
}
