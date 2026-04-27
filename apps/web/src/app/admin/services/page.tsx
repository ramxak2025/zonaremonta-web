import { services } from '@/lib/content';
import { requireAdmin } from '@/lib/admin-auth';
import { ServicesEditor } from './editor';

export const dynamic = 'force-dynamic';

export default async function AdminServicesPage() {
  await requireAdmin('/admin/services');
  const data = await services.read();
  return (
    <div>
      <header className="mb-8">
        <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#FF3E4F] mb-2">
          Контент
        </div>
        <h1 className="font-display font-bold uppercase tracking-tight text-white text-[24px] md:text-[32px] leading-tight">
          Услуги и цены
        </h1>
        <p className="text-[14px] text-white/60 mt-3 max-w-prose">
          Комплекты установки ГБО (отображаются на главной, /install и в навигации) и
          услуги ремонта (показываются на /repair).
        </p>
      </header>
      <ServicesEditor initial={data} />
    </div>
  );
}
