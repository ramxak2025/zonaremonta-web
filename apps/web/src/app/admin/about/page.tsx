import { about } from '@/lib/content';
import { requireAdmin } from '@/lib/admin-auth';
import { AboutEditor } from './editor';

export const dynamic = 'force-dynamic';

export default async function AdminAboutPage() {
  await requireAdmin('/admin/about');
  const data = await about.read();
  return (
    <div>
      <header className="mb-8">
        <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#FF3E4F] mb-2">
          Контент
        </div>
        <h1 className="font-display font-bold uppercase tracking-tight text-white text-[24px] md:text-[32px] leading-tight">
          О сервисе
        </h1>
        <p className="text-[14px] text-white/60 mt-3 max-w-prose">
          История, философия, преимущества. Используется на странице /about и фрагментами на главной.
        </p>
      </header>
      <AboutEditor initial={data} />
    </div>
  );
}
