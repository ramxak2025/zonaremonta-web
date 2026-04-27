import { contact } from '@/lib/content';
import { requireAdmin } from '@/lib/admin-auth';
import { ContactEditor } from './editor';

export const dynamic = 'force-dynamic';

export default async function AdminContactPage() {
  await requireAdmin('/admin/contact');
  const data = await contact.read();
  return (
    <div>
      <header className="mb-8">
        <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#FF3E4F] mb-2">
          Контент
        </div>
        <h1 className="font-display font-bold uppercase tracking-tight text-white text-[24px] md:text-[32px] leading-tight">
          Контакты
        </h1>
        <p className="text-[14px] text-white/60 mt-3 max-w-prose">
          Телефон, адрес, часы работы и ссылки на мессенджеры. Координаты используются
          для маркера на Я.Карте в секции «Контакты».
        </p>
      </header>
      <ContactEditor initial={data} />
    </div>
  );
}
