'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, Calendar, Wrench } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';
import { WORKS, type Work } from '@/data/works';

const TYPE_LABEL: Record<Work['type'], string> = {
  mpi: 'MPI',
  gdi: 'Прямой впрыск',
  combined: 'D-4S / Combined',
};

export function WorksGrid() {
  const [active, setActive] = useState<Work | null>(null);
  const [idx, setIdx] = useState(0);

  // Блокируем скролл фона при открытой модалке
  useEffect(() => {
    if (!active) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [active]);

  // Esc и стрелки
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActive(null);
      if (e.key === 'ArrowRight') setIdx((i) => (i + 1) % active.process.length);
      if (e.key === 'ArrowLeft') setIdx((i) => (i - 1 + active.process.length) % active.process.length);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active]);

  const open = (w: Work) => {
    setIdx(0);
    setActive(w);
  };

  return (
    <>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        {WORKS.map((w, i) => (
          <Reveal key={w.id} delay={Math.min(i * 60, 360)}>
            <button
              type="button"
              onClick={() => open(w)}
              className="group block w-full text-left rounded-3xl overflow-hidden relative"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={w.cover}
                  alt={`${w.brand} ${w.model}`}
                  width={1200}
                  height={800}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                  unoptimized
                />
                <div
                  aria-hidden
                  className="absolute inset-0 pointer-events-none"
                  style={{ background: 'linear-gradient(180deg, transparent 50%, rgba(10,10,16,0.85) 100%)' }}
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  <span
                    className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
                    style={{
                      background: 'rgba(232,18,36,0.85)',
                      color: 'white',
                      boxShadow: '0 4px 12px rgba(232,18,36,0.4)',
                    }}
                  >
                    {TYPE_LABEL[w.type]}
                  </span>
                </div>
                <div className="absolute bottom-3 right-3 text-[11px] font-bold uppercase tracking-[0.14em] text-white/80 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/40 border border-white/15">
                  +{w.process.length} фото
                </div>
              </div>

              <div className="p-5">
                <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/40 mb-1">
                  {w.year} · {w.engine}
                </div>
                <h3 className="font-display font-bold uppercase tracking-tight text-white text-[18px] md:text-[20px] leading-tight">
                  {w.brand} {w.model}
                </h3>
                <p className="mt-2 text-[13px] text-white/65 leading-relaxed text-break clamp-2">
                  {w.equipment}
                </p>
                <div className="mt-3 pt-3 border-t border-white/5 flex items-baseline justify-between gap-2">
                  <span className="font-display font-bold text-white text-[18px] leading-none">
                    {w.price.toLocaleString('ru-RU')} ₽
                  </span>
                  <span className="text-[11px] text-white/40 inline-flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(w.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
                  </span>
                </div>
              </div>
            </button>
          </Reveal>
        ))}
      </div>

      {active && active.process[idx] && (
        <ModalView
          work={active}
          idx={idx}
          frame={active.process[idx]}
          onClose={() => setActive(null)}
          onPrev={() => setIdx((i) => (i - 1 + active.process.length) % active.process.length)}
          onNext={() => setIdx((i) => (i + 1) % active.process.length)}
        />
      )}
    </>
  );
}

function ModalView({
  work, idx, frame, onClose, onPrev, onNext,
}: {
  work: Work;
  idx: number;
  frame: { src: string; caption: string };
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
        <div
          role="dialog"
          aria-modal="true"
          className="fade-in fixed inset-0 z-[100] grid items-end md:items-center justify-center"
          onClick={onClose}
          style={{ background: 'rgba(0,0,0,0.78)', backdropFilter: 'blur(8px)' }}
        >
          <div
            className="modal-in w-full md:max-w-3xl mx-auto md:rounded-3xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#14141A',
              border: '1px solid rgba(255,255,255,0.12)',
              maxHeight: '92vh',
              boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
            }}
          >
            {/* Слайд */}
            <div className="relative aspect-[4/3] bg-black">
              <Image
                src={frame.src}
                alt={frame.caption}
                width={1200}
                height={800}
                className="w-full h-full object-cover"
                unoptimized
                priority
              />
              <button
                type="button"
                aria-label="Закрыть"
                onClick={onClose}
                className="absolute top-3 right-3 w-10 h-10 rounded-full grid place-items-center bg-black/60 border border-white/20 text-white hover:bg-black/80"
              >
                <X className="w-5 h-5" />
              </button>
              <button
                type="button"
                aria-label="Предыдущая"
                onClick={onPrev}
                className="absolute top-1/2 left-3 -translate-y-1/2 w-10 h-10 rounded-full grid place-items-center bg-black/60 border border-white/20 text-white hover:bg-black/80"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                aria-label="Следующая"
                onClick={onNext}
                className="absolute top-1/2 right-3 -translate-y-1/2 w-10 h-10 rounded-full grid place-items-center bg-black/60 border border-white/20 text-white hover:bg-black/80"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              <div className="absolute bottom-3 left-3 right-3 inline-flex items-center justify-between gap-3 text-white">
                <span className="text-[12px] uppercase tracking-widest opacity-80">
                  {idx + 1} / {work.process.length}
                </span>
                <span className="text-[13px] font-medium opacity-95 truncate text-right">
                  {frame.caption}
                </span>
              </div>
            </div>

            {/* Информация */}
            <div className="p-5 md:p-6 max-h-[40vh] overflow-y-auto">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/40">
                    {work.year} · {work.engine}
                  </div>
                  <h3 className="mt-1 font-display font-bold uppercase tracking-tight text-white text-[22px] md:text-[26px] leading-tight">
                    {work.brand} {work.model}
                  </h3>
                </div>
                <span
                  className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full flex-shrink-0"
                  style={{
                    background: 'rgba(232,18,36,0.15)',
                    color: '#FF3E4F',
                    border: '1px solid rgba(232,18,36,0.3)',
                  }}
                >
                  {TYPE_LABEL[work.type]}
                </span>
              </div>

              <div className="mt-4 flex items-center gap-2 text-[13px] text-white/75">
                <Wrench className="w-4 h-4 text-[#FF3E4F]" />
                {work.equipment}
              </div>

              <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between gap-3">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/40">
                    Стоимость работ
                  </div>
                  <div className="font-display font-bold text-white text-[22px] mt-1 leading-none">
                    {work.price.toLocaleString('ru-RU')} ₽
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/40">
                    Дата работы
                  </div>
                  <div className="text-white text-[14px] mt-1">
                    {new Date(work.date).toLocaleDateString('ru-RU', {
                      day: 'numeric', month: 'long', year: 'numeric',
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
  );
}
