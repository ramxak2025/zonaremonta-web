import type { Metadata } from 'next';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Политика конфиденциальности',
  description: 'Политика обработки персональных данных «Зона Ремонта» / 05auto.',
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="section py-16 max-w-3xl text-white/80 space-y-5">
        <h1 className="h-section text-white">Политика конфиденциальности</h1>
        <p className="text-white/50">Действует с {new Date().getFullYear()} года.</p>

        <h2 className="font-display text-2xl text-white mt-8">1. Общие положения</h2>
        <p>
          Настоящая Политика описывает порядок обработки персональных данных на сайте
          <a href={SITE.siteUrl} className="text-primary"> {SITE.domain}</a> (далее — «Сайт»),
          принадлежащем организации, оказывающей услуги по установке, ремонту и диагностике
          газобаллонного оборудования (далее — «Оператор»). Политика составлена в соответствии
          с Федеральным законом № 152-ФЗ «О персональных данных».
        </p>

        <h2 className="font-display text-2xl text-white mt-8">2. Какие данные мы обрабатываем</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Номер телефона — для связи по заявкам и входа в личный кабинет.</li>
          <li>Имя (необязательно) — для обращения к клиенту.</li>
          <li>Технические cookies и локальное хранилище — для работы сайта.</li>
        </ul>

        <h2 className="font-display text-2xl text-white mt-8">3. Цели обработки</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Обработка заявки на обратный звонок и запись на сервис.</li>
          <li>Идентификация клиента в личном кабинете и хранение истории обслуживания.</li>
          <li>Отправка служебных SMS (код входа, уведомления).</li>
        </ul>

        <h2 className="font-display text-2xl text-white mt-8">4. Правовые основания</h2>
        <p>Согласие субъекта персональных данных (ч. 1 ст. 6 152-ФЗ) и исполнение договора оказания услуг.</p>

        <h2 className="font-display text-2xl text-white mt-8">5. Сроки хранения</h2>
        <p>
          Номер телефона и история обслуживания — на всё время действия договора и 3 года после
          последнего визита. SMS-коды — не более 5 минут, хранятся только в хэшированном виде.
        </p>

        <h2 className="font-display text-2xl text-white mt-8">6. Передача третьим лицам</h2>
        <p>
          Мы не передаём персональные данные третьим лицам, за исключением операторов SMS-связи
          (SMSC, SMS.ru) — в объёме, необходимом для доставки сообщения.
        </p>

        <h2 className="font-display text-2xl text-white mt-8">7. Права субъекта</h2>
        <p>
          Вы вправе запросить доступ к своим данным, их уточнение или удаление, направив обращение
          на {SITE.phone}. Ответ в течение 10 рабочих дней.
        </p>

        <h2 className="font-display text-2xl text-white mt-8">8. Контакты</h2>
        <p>{SITE.address}. Телефон: {SITE.phone}.</p>
      </main>
      <Footer />
    </>
  );
}
