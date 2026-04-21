'use client';
import { Settings } from 'lucide-react';
import { SoonPage } from '@/components/lk/SoonPage';
import { CLIENT_NAV } from '@/components/lk/client-nav';

export default function Page() {
  return <SoonPage role="CLIENT" title="Профиль" nav={CLIENT_NAV} icon={Settings} text="Имя, телефон (смена через SMS), уведомления." />;
}
