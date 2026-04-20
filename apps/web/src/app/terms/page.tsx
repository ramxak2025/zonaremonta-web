import type { Metadata } from 'next';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = { title: 'Пользовательское соглашение' };

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="section py-16 max-w-3xl text-white/80 space-y-5">
        <h1 className="h-section text-white">Пользовательское соглашение</h1>
        <p>Соглашение регулирует условия использования сайта 05auto.ru и личных кабинетов.</p>
        <h2 className="font-display text-2xl text-white mt-8">1. Предмет</h2>
        <p>Использование сайта бесплатно. Услуги автосервиса — по отдельному договору.</p>
        <h2 className="font-display text-2xl text-white mt-8">2. Авторизация клиента</h2>
        <p>Вход в ЛК — по номеру телефона и одноразовому SMS-коду.</p>
        <h2 className="font-display text-2xl text-white mt-8">3. Ответственность</h2>
        <p>Компания не отвечает за неверно введённые клиентом данные (VIN, госномер).</p>
        <h2 className="font-display text-2xl text-white mt-8">4. Изменения</h2>
        <p>Актуальная редакция публикуется на Сайте.</p>
      </main>
      <Footer />
    </>
  );
}
