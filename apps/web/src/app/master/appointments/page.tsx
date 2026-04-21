'use client';
import { Calendar } from 'lucide-react';
import { SoonPage } from '@/components/lk/SoonPage';
import { MASTER_NAV } from '@/components/lk/master-nav';

export default function Page() {
  return <SoonPage role="MASTER" title="Расписание" nav={MASTER_NAV} icon={Calendar} text="Ваше расписание на день и неделю. Назначенные клиенты и слоты." />;
}
