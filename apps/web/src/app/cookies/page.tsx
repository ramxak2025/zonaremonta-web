import type { Metadata } from 'next';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = { title: 'Использование cookies' };

export default function CookiesPage() {
  return (
    <>
      <Header />
      <main className="section py-16 prose prose-neutral max-w-3xl">
        <h1 className="h-section">Использование cookies</h1>
        <p>
          Сайт использует <strong>только технические cookies</strong>, необходимые для его работы:
          авторизация (refresh_token, httpOnly), защита от CSRF, предпочтения интерфейса.
        </p>
        <p>
          Аналитические и рекламные cookies третьих сторон (Яндекс.Метрика, Google Analytics, VK Pixel и т. п.)
          на сайте не используются. Они будут подключены после подачи оператором уведомления в
          Роскомнадзор и обновления данной страницы с cookie-баннером.
        </p>
        <p>
          Вы можете отключить cookies в настройках браузера — некоторые функции сайта в этом случае станут недоступны.
        </p>
      </main>
      <Footer />
    </>
  );
}
