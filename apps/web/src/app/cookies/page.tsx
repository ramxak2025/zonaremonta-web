import type { Metadata } from 'next';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = { title: 'Использование cookies' };

export default function CookiesPage() {
  return (
    <>
      <Header />
      <main className="section py-16 max-w-3xl text-white/80 space-y-5">
        <h1 className="h-section text-white">Использование cookies</h1>
        <p>
          Сайт использует <strong className="text-white">только технические cookies</strong>:
          авторизация (refresh_token), защита от CSRF, предпочтения интерфейса.
        </p>
        <p>
          Аналитические и рекламные cookies третьих сторон не используются.
          Они будут подключены после подачи уведомления в Роскомнадзор.
        </p>
        <p>
          Отключить cookies можно в настройках браузера — часть функций сайта в этом случае станет недоступна.
        </p>
      </main>
      <Footer />
    </>
  );
}
