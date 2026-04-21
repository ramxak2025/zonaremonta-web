'use client';
import { History } from 'lucide-react';
import { SoonPage } from '@/components/lk/SoonPage';
import { CLIENT_NAV } from '@/components/lk/client-nav';

export default function Page() {
  return <SoonPage role="CLIENT" title="История ТО" nav={CLIENT_NAV} icon={History} text="Все работы по каждому авто — из нарядов в нашем сервисе и записи о внешних." />;
}
