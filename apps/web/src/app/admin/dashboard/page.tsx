'use client';
import {
  Banknote, Bell, BookOpen, Car, FileText, Home, Package, PhoneCall,
  Settings, Users, UserCog, Wrench,
} from 'lucide-react';
import { AppShell } from '@/components/lk/AppShell';
import { StatCard, Loading } from '@/components/lk/UiKit';
import { useApi, useAuth } from '@/lib/auth-client';

const NAV = [
  { href: '/admin/dashboard', label: 'Главная', icon: Home },
  { href: '/admin/clients', label: 'Клиенты', icon: Users },
  { href: '/admin/callbacks', label: 'Заявки', icon: PhoneCall },
  { href: '/admin/work-orders', label: 'Наряды', icon: Wrench },
  { href: '/admin/inventory', label: 'Склад', icon: Package },
  { href: '/admin/finance', label: 'Финансы', icon: Banknote },
  { href: '/admin/masters', label: 'Мастера', icon: UserCog },
  { href: '/admin/content', label: 'Контент', icon: BookOpen },
  { href: '/admin/instructions', label: 'Инструкции', icon: FileText },
  { href: '/admin/settings', label: 'Настройки', icon: Settings },
] as const;

interface ClientsResponse {
  items: Array<{ id: string; phone: string; name: string | null }>;
  total: number;
}

interface CallbackRequest {
  id: string;
  status: 'NEW' | 'IN_PROGRESS' | 'DONE' | 'SPAM';
  createdAt: string;
}

interface WorkOrder {
  id: string;
  status: 'NEW' | 'IN_PROGRESS' | 'DONE' | 'CANCELLED';
  totalCost: number | string;
}

export default function AdminDashboard() {
  const { me, loading: authLoading } = useAuth('DIRECTOR');
  const { data: clients } = useApi<ClientsResponse>(me ? '/clients?pageSize=1' : null);
  const { data: callbacks } = useApi<CallbackRequest[]>(me ? '/callback' : null);
  const { data: workOrders } = useApi<WorkOrder[]>(me ? '/work-orders' : null);

  if (authLoading) {
    return (
      <AppShell nav={NAV} me={me} title="Панель управления">
        <Loading />
      </AppShell>
    );
  }

  const newCallbacks = callbacks?.filter((c) => c.status === 'NEW').length ?? 0;
  const inProgressOrders = workOrders?.filter((o) => o.status === 'IN_PROGRESS').length ?? 0;
  const doneOrders = workOrders?.filter((o) => o.status === 'DONE') ?? [];
  const totalRevenue = doneOrders.reduce((sum, o) => sum + Number(o.totalCost), 0);

  return (
    <AppShell nav={NAV} me={me} title="Панель управления">
      {/* KPI */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-8">
        <StatCard
          label="Клиенты"
          value={clients?.total ?? 0}
          hint="в базе"
          icon={Users}
          accent="blue"
        />
        <StatCard
          label="Новые заявки"
          value={newCallbacks}
          hint={newCallbacks > 0 ? 'требуют внимания' : 'все обработаны'}
          icon={Bell}
          accent="red"
        />
        <StatCard
          label="Наряды в работе"
          value={inProgressOrders}
          icon={Wrench}
          accent="yellow"
        />
        <StatCard
          label="Выручка"
          value={`${totalRevenue.toLocaleString('ru-RU')} ₽`}
          hint="закрытые наряды"
          icon={Banknote}
          accent="green"
        />
      </div>

      {/* Основные разделы */}
      <h2 className="h-2 text-white mb-4">Разделы</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        <SectionCard href="/admin/clients" icon={Users} title="Клиенты" text="База клиентов и авто, фильтры, история работ" />
        <SectionCard href="/admin/callbacks" icon={PhoneCall} title="Заявки" text="Заявки обратного звонка, статусы, назначение мастера" badge={newCallbacks > 0 ? String(newCallbacks) : undefined} />
        <SectionCard href="/admin/work-orders" icon={Wrench} title="Наряды" text="Все наряд-заказы: открытые, в работе, закрытые" />
        <SectionCard href="/admin/inventory" icon={Package} title="Склад" text="Приходы, списания, минимальные остатки" />
        <SectionCard href="/admin/finance" icon={Banknote} title="Финансы" text="Касса, отчёты, зарплата мастеров" />
        <SectionCard href="/admin/masters" icon={UserCog} title="Мастера" text="Аккаунты, специализации, аудит действий" />
        <SectionCard href="/admin/content" icon={BookOpen} title="Контент" text="Блог, FAQ, отзывы, сертификаты" />
        <SectionCard href="/admin/instructions" icon={FileText} title="Инструкции" text="База знаний: фото + VK-видео для мастеров" />
        <SectionCard href="/admin/settings" icon={Settings} title="Настройки сайта" text="Баннер, цены топлива, контакты, рейтинги" />
      </div>
    </AppShell>
  );
}

function SectionCard({
  href, icon: Icon, title, text, badge,
}: {
  href: string;
  icon: typeof Car;
  title: string;
  text: string;
  badge?: string;
}) {
  return (
    <a
      href={href}
      className="card-strong p-5 md:p-6 flex items-start gap-4 hover:bg-white/[0.06] transition-colors"
    >
      <span className="w-11 h-11 rounded-xl grid place-items-center bg-primary/20 border border-primary/30 flex-none">
        <Icon className="w-5 h-5 text-[#FF3E4F]" strokeWidth={2.2} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="h-3 text-white">{title}</h3>
          {badge && (
            <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-primary text-white">
              {badge}
            </span>
          )}
        </div>
        <p className="text-white/55 text-[13px] mt-1 leading-relaxed">{text}</p>
      </div>
    </a>
  );
}
