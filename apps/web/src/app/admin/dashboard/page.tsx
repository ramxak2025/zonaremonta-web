import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export const metadata = { robots: { index: false, follow: false }, title: 'Админка' };

const sections = [
  { title: 'CRM', text: 'База клиентов и авто, лента заявок, тэги и фильтры.' },
  { title: 'Складской учёт', text: 'Позиции, приходы, списания, минимальные остатки.' },
  { title: 'Финансы', text: 'Касса, отчёты, зарплата мастеров, графики.' },
  { title: 'Контроль мастеров', text: 'Загрузка, скорость закрытия, аудит действий.' },
  { title: 'Контент сайта', text: 'Блог, FAQ, отзывы, сертификаты, SEO.' },
  { title: 'Инструкции', text: 'Фото, VK-видео, база знаний для мастеров.' },
  { title: 'Настройки', text: 'Адреса, телефоны, график работы, слоты.' },
];

export default function AdminDashboard() {
  return (
    <>
      <Header />
      <main className="section py-12">
        <h1 className="h-section">Директорская панель</h1>
        <p className="text-ink-70 mt-2">
          Приоритеты: CRM → Склад → Финансы → Контроль мастеров → CMS → SEO.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
          {sections.map((s) => (
            <div key={s.title} className="card">
              <h3 className="font-display text-lg">{s.title}</h3>
              <p className="text-ink-70 text-sm mt-1">{s.text}</p>
              <span className="chip mt-3">API готов</span>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
