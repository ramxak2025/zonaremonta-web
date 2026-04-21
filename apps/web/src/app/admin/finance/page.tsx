'use client';
import { Banknote } from 'lucide-react';
import { SoonPage } from '@/components/lk/SoonPage';
import { ADMIN_NAV } from '@/components/lk/admin-nav';

export default function AdminFinance() {
  return (
    <SoonPage
      role="DIRECTOR"
      title="Финансы"
      nav={ADMIN_NAV}
      icon={Banknote}
      text="Касса, доходы/расходы, зарплата мастеров, графики. API готов."
    />
  );
}
