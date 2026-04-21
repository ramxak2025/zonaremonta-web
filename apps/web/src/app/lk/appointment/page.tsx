'use client';
import { Calendar } from 'lucide-react';
import { SoonPage } from '@/components/lk/SoonPage';
import { CLIENT_NAV } from '@/components/lk/client-nav';

export default function Page() {
  return <SoonPage role="CLIENT" title="Записаться на сервис" nav={CLIENT_NAV} icon={Calendar} text="Выбор авто, услуги и слота. Слоты из расписания сервиса." />;
}
