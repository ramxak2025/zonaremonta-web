'use client';
import { FileText } from 'lucide-react';
import { SoonPage } from '@/components/lk/SoonPage';
import { ADMIN_NAV } from '@/components/lk/admin-nav';

export default function AdminInstructions() {
  return (
    <SoonPage
      role="DIRECTOR"
      title="Инструкции для мастеров"
      nav={ADMIN_NAV}
      icon={FileText}
      text="База знаний: фото + VK-видео по маркам, моделям и типам работ."
    />
  );
}
