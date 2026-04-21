'use client';
import { Bell } from 'lucide-react';
import { SoonPage } from '@/components/lk/SoonPage';
import { CLIENT_NAV } from '@/components/lk/client-nav';

export default function Page() {
  return <SoonPage role="CLIENT" title="Напоминания" nav={CLIENT_NAV} icon={Bell} text="Поверка баллона, ОСАГО, ТО, замена масла — пуш на SMS за 7 дней." />;
}
