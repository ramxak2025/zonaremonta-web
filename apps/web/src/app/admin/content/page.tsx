'use client';
import { BookOpen } from 'lucide-react';
import { SoonPage } from '@/components/lk/SoonPage';
import { ADMIN_NAV } from '@/components/lk/admin-nav';

export default function AdminContent() {
  return (
    <SoonPage
      role="DIRECTOR"
      title="Контент сайта"
      nav={ADMIN_NAV}
      icon={BookOpen}
      text="Блог, FAQ, отзывы, сертификаты. Редактирование через визуальный CMS."
    />
  );
}
