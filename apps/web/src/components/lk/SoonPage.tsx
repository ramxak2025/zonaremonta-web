'use client';
import { Wrench } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { AppShell } from './AppShell';
import { EmptyState } from './UiKit';
import { useAuth, type Me } from '@/lib/auth-client';

export function SoonPage({
  role, title, nav, icon: Icon, text,
}: {
  role: Me['role'];
  title: string;
  nav: React.ComponentProps<typeof AppShell>['nav'];
  icon?: LucideIcon;
  text?: string;
}) {
  const { me } = useAuth(role);
  return (
    <AppShell nav={nav} me={me} title={title}>
      <EmptyState
        icon={Icon ?? Wrench}
        title="Раздел в разработке"
        description={text ?? 'Мы готовим интерфейс. API уже работает — секция появится со дня на день.'}
      />
    </AppShell>
  );
}
