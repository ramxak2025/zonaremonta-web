import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export const metadata = { robots: { index: false, follow: false }, title: 'ЛК мастера' };

export default function MasterDashboard() {
  return (
    <>
      <Header />
      <main className="section py-12">
        <h1 className="h-section">Кабинет мастера</h1>
        <p className="text-ink-70 mt-2">Лента заявок, расписание, наряды, инструкции, база знаний.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
          {['Мои заявки', 'Расписание', 'Наряды', 'Инструкции', 'База знаний', 'Профиль'].map((t) => (
            <div key={t} className="card">
              <h3 className="font-display text-lg">{t}</h3>
              <p className="text-ink-50 text-sm mt-1">Реализация интерфейса — во второй итерации. API готов.</p>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
