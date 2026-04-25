import type { ReactNode } from 'react';
import { Container } from './Container';

interface Props {
  id?: string;
  children: ReactNode;
  className?: string;
  /** Убирает вертикальные отступы (для secondary вложенных секций). */
  noPad?: boolean;
}

/**
 * Стандартная секция — vertical padding + контейнер.
 * 48px (mobile) → 64px (md) → 96px (lg).
 */
export function Section({ id, children, className = '', noPad }: Props) {
  return (
    <section
      id={id}
      className={`${noPad ? '' : 'py-12 md:py-16 lg:py-24'} ${className}`}
    >
      <Container>{children}</Container>
    </section>
  );
}
