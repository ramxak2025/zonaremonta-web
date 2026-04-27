import { works } from '@/lib/content';
import { requireAdmin } from '@/lib/admin-auth';
import { WorksEditor } from './editor';

export const dynamic = 'force-dynamic';

export default async function AdminWorksPage() {
  await requireAdmin('/admin/works');
  const data = await works.read();
  return (
    <div>
      <header className="mb-8">
        <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#FF3E4F] mb-2">
          Контент
        </div>
        <h1 className="font-display font-bold uppercase tracking-tight text-white text-[24px] md:text-[32px] leading-tight">
          Наши работы
        </h1>
        <p className="text-[14px] text-white/60 mt-3 max-w-prose">
          Каталог работ. Каждая карточка — авто, на которое ставили ГБО, плюс галерея фото
          процесса. Обложка показывается в /works, фото процесса — в модалке при клике.
        </p>
      </header>
      <WorksEditor initial={data} />
    </div>
  );
}
