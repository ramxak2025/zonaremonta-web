'use client';
import { BookOpen } from 'lucide-react';
import { SoonPage } from '@/components/lk/SoonPage';
import { MASTER_NAV } from '@/components/lk/master-nav';

export default function Page() {
  return <SoonPage role="MASTER" title="Инструкции" nav={MASTER_NAV} icon={BookOpen} text="База знаний: фото + VK-видео, типовые проблемы ГБО, распиновки." />;
}
