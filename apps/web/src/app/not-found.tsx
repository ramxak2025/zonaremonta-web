import Link from 'next/link';
import { Section } from '@/components/ui/Section';

export default function NotFound() {
  return (
    <Section>
      <div className="text-center py-12">
        <div
          className="font-display font-bold leading-none"
          style={{
            fontSize: 'clamp(80px, 14vw, 140px)',
            background: 'linear-gradient(135deg, #FF3E4F, #B40E1C)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
            paddingBottom: '0.06em',
          }}
        >
          404
        </div>
        <h1 className="mt-4 font-display font-bold uppercase text-white text-[24px] md:text-[32px]">
          Страница не найдена
        </h1>
        <p className="mt-3 text-white/60 max-w-md mx-auto">
          Возможно, она переехала или адрес введён с ошибкой.
        </p>
        <Link href="/" className="btn btn-primary mt-8 inline-flex">
          На главную
        </Link>
      </div>
    </Section>
  );
}
