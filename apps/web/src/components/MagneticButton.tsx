'use client';
import { useRef, type MouseEvent, type ReactNode } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import Link from 'next/link';

interface Props {
  href?: string;
  onClick?: () => void;
  className?: string;
  children: ReactNode;
  strength?: number;
}

export function MagneticButton({ href, onClick, className = '', children, strength = 0.3 }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 15 });
  const sy = useSpring(y, { stiffness: 200, damping: 15 });

  const onMove = (e: MouseEvent<HTMLSpanElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    x.set((e.clientX - cx) * strength);
    y.set((e.clientY - cy) * strength);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  const Inner = (
    <motion.span
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ x: sx, y: sy, display: 'inline-block' }}
      className={className}
      onClick={onClick}
    >
      {children}
    </motion.span>
  );

  return href ? <Link href={href}>{Inner}</Link> : Inner;
}
