import type { ReactNode } from 'react';

interface Props {
  label: string;
  hint?: string;
  children: ReactNode;
  cols?: 1 | 2;
}

export function Field({ label, hint, children, cols = 1 }: Props) {
  return (
    <label className={`block ${cols === 2 ? 'sm:col-span-2' : ''}`}>
      <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/55">{label}</span>
      <div className="mt-2">{children}</div>
      {hint && <p className="text-[12px] text-white/40 mt-1.5">{hint}</p>}
    </label>
  );
}

const inputBase =
  'w-full h-11 px-3.5 rounded-lg bg-white/[0.04] border border-white/10 text-white text-[14px] focus:outline-none focus:border-[#FF3E4F] transition-colors disabled:opacity-50';

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${inputBase} ${props.className ?? ''}`} />;
}

export function NumberInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input type="number" {...props} className={`${inputBase} ${props.className ?? ''}`} />;
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`w-full px-3.5 py-3 rounded-lg bg-white/[0.04] border border-white/10 text-white text-[14px] leading-relaxed focus:outline-none focus:border-[#FF3E4F] transition-colors min-h-[100px] resize-y ${
        props.className ?? ''
      }`}
    />
  );
}

export function Card({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <section
      className="rounded-2xl p-5 md:p-6"
      style={{ background: 'rgba(20,20,26,0.6)', border: '1px solid rgba(255,255,255,0.08)' }}
    >
      {title && (
        <h2 className="font-display font-semibold uppercase tracking-tight text-white text-[16px] md:text-[18px] mb-5">
          {title}
        </h2>
      )}
      {children}
    </section>
  );
}
