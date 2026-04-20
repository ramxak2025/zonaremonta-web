const STATS = [
  { num: '2 500+', label: 'Установок ГБО' },
  { num: '8 лет', label: 'На рынке Махачкалы' },
  { num: '1 день', label: 'Срок установки' },
  { num: '24/7', label: 'Техподдержка' },
] as const;

export function TrustBar() {
  return (
    <section className="border-y border-white/5 bg-[#0D0D10]">
      <div className="section py-10 md:py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
          {STATS.map((s) => (
            <div key={s.label} className="text-center md:text-left">
              <div className="font-display text-[32px] md:text-[44px] leading-none text-white tracking-tight">
                {s.num}
              </div>
              <div className="mt-2 text-sm text-white/55">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
