import type { Metadata } from 'next';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Блог о ГБО',
  description: 'Статьи для автовладельцев: установка ГБО, обслуживание, экономия на топливе.',
  alternates: { canonical: `${SITE.siteUrl}/blog` },
};

export default function BlogPage() {
  return (
    <>
      <Header />
      <main className="section section-y">
        <span className="eyebrow">Полезное</span>
        <h1 className="h-1 mt-3 text-white">Блог</h1>
        <p className="lead mt-4 max-w-2xl">
          Раздел в разработке. Первые статьи о выборе оборудования, экономии на топливе и обслуживании
          появятся здесь после наполнения из админки.
        </p>
      </main>
      <Footer />
    </>
  );
}
