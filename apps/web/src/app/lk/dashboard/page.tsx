'use client';
import Link from 'next/link';
import { Bell, Car, CreditCard, History, Plus } from 'lucide-react';
import { AppShell } from '@/components/lk/AppShell';
import { CLIENT_NAV } from '@/components/lk/client-nav';
import { StatCard, EmptyState, Loading } from '@/components/lk/UiKit';
import { useAuth, useApi } from '@/lib/auth-client';

interface Vehicle {
  id: string;
  licensePlate: string;
  year: number;
  hasGbo: boolean;
  brand: { name: string };
  model: { name: string };
}

interface Reminder {
  id: string;
  title: string;
  dueAt: string;
  type: string;
}

interface ClientMe {
  id: string;
  name: string | null;
  phone: string;
  vehicles: Vehicle[];
}

export default function Dashboard() {
  const { me, loading: authLoading } = useAuth('CLIENT');
  const { data: client, loading } = useApi<ClientMe>(me ? '/clients/me' : null);
  const { data: reminders } = useApi<Reminder[]>(me ? '/reminders/me' : null);

  if (authLoading || loading) {
    return (
      <AppShell nav={CLIENT_NAV} me={me} title="Загрузка">
        <Loading />
      </AppShell>
    );
  }

  const name = client?.name ?? 'клиент';

  return (
    <AppShell nav={CLIENT_NAV} me={me} title={`Добрый день, ${name}!`}>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-8">
        <StatCard label="Мои авто" value={client?.vehicles?.length ?? 0} icon={Car} accent="red" />
        <StatCard
          label="С ГБО"
          value={client?.vehicles?.filter((v) => v.hasGbo).length ?? 0}
          icon={CreditCard}
          accent="green"
        />
        <StatCard
          label="Напоминания"
          value={reminders?.length ?? 0}
          hint={reminders?.length ? 'активных' : 'всё спокойно'}
          icon={Bell}
          accent="yellow"
        />
        <StatCard label="Визитов" value={0} hint="история работ" icon={History} accent="blue" />
      </div>

      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="h-2 text-white">Мои автомобили</h2>
          <Link href="/lk/vehicles" className="text-[13px] text-white/60 hover:text-white">
            Все авто →
          </Link>
        </div>
        {client?.vehicles && client.vehicles.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {client.vehicles.slice(0, 3).map((v) => (
              <div key={v.id} className="card-strong p-5">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-10 h-10 rounded-xl grid place-items-center bg-primary/20 border border-primary/30">
                    <Car className="w-4 h-4 text-[#FF3E4F]" strokeWidth={2.2} />
                  </span>
                  <div>
                    <div className="font-display text-lg text-white leading-tight">
                      {v.brand.name} {v.model.name}
                    </div>
                    <div className="text-xs text-white/55">{v.year} г.</div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/70 font-mono">{v.licensePlate}</span>
                  {v.hasGbo && (
                    <span className="text-[10px] px-2 py-1 rounded-full bg-[#22C55E]/15 border border-[#22C55E]/30 text-[#22C55E] font-semibold uppercase tracking-widest">
                      ГБО
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Car}
            title="Автомобили ещё не добавлены"
            description="Добавьте авто, чтобы вести историю ТО, расходов и получать напоминания о поверке баллона."
            cta={
              <Link href="/lk/vehicles" className="btn btn-primary">
                <Plus className="w-4 h-4" />
                Добавить первое авто
              </Link>
            }
          />
        )}
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="h-2 text-white">Напоминания</h2>
          <Link href="/lk/reminders" className="text-[13px] text-white/60 hover:text-white">
            Все →
          </Link>
        </div>
        {reminders && reminders.length > 0 ? (
          <div className="card-strong divide-y divide-white/5">
            {reminders.slice(0, 5).map((r) => (
              <div key={r.id} className="p-5 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="text-white font-medium">{r.title}</div>
                  <div className="text-white/55 text-xs mt-0.5">
                    До: {new Date(r.dueAt).toLocaleDateString('ru-RU')}
                  </div>
                </div>
                <span className="text-[10px] px-2 py-1 rounded-full bg-[#FFCC00]/15 border border-[#FFCC00]/30 text-[#FFCC00] font-semibold uppercase tracking-widest">
                  {r.type}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Bell}
            title="Нет активных напоминаний"
            description="Здесь появятся напоминания о поверке баллона, ОСАГО и плановом ТО."
          />
        )}
      </section>
    </AppShell>
  );
}
