'use client';
import { Package } from 'lucide-react';
import { SoonPage } from '@/components/lk/SoonPage';
import { ADMIN_NAV } from '@/components/lk/admin-nav';

export default function AdminInventory() {
  return (
    <SoonPage
      role="DIRECTOR"
      title="Складской учёт"
      nav={ADMIN_NAV}
      icon={Package}
      text="Позиции, приходы, списания, инвентаризация. API готов — подключаем интерфейс."
    />
  );
}
