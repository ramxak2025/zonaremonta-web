'use client';
import { Wallet } from 'lucide-react';
import { SoonPage } from '@/components/lk/SoonPage';
import { CLIENT_NAV } from '@/components/lk/client-nav';

export default function Page() {
  return <SoonPage role="CLIENT" title="Траты на авто" nav={CLIENT_NAV} icon={Wallet} text="Категории: топливо, мойка, страховка, штрафы, ремонт. График по месяцам." />;
}
