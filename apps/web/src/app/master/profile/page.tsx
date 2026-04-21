'use client';
import { Settings } from 'lucide-react';
import { SoonPage } from '@/components/lk/SoonPage';
import { MASTER_NAV } from '@/components/lk/master-nav';

export default function Page() {
  return <SoonPage role="MASTER" title="Профиль" nav={MASTER_NAV} icon={Settings} text="Профиль, смена пароля, 2FA." />;
}
