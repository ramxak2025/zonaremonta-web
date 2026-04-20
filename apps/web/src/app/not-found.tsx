import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="section py-24 text-center">
        <div className="font-display text-7xl text-primary">404</div>
        <h1 className="h-section mt-4">Страница не найдена</h1>
        <p className="text-ink-70 mt-2">Возможно, она переехала или адрес введён с ошибкой.</p>
        <Link href="/" className="btn-primary mt-6 inline-flex">На главную</Link>
      </main>
      <Footer />
    </>
  );
}
