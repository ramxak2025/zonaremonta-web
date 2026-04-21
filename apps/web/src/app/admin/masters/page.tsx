'use client';
import { UserCog } from 'lucide-react';
import { SoonPage } from '@/components/lk/SoonPage';
import { ADMIN_NAV } from '@/components/lk/admin-nav';

export default function AdminMasters() {
  return (
    <SoonPage
      role="DIRECTOR"
      title="Мастера"
      nav={ADMIN_NAV}
      icon={UserCog}
      text="Аккаунты мастеров, специализации, загрузка, аудит действий."
    />
  );
}
