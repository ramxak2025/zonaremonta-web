/**
 * Фон: тёмный графит с одной мягкой красной подсветкой справа-сверху.
 * Пульсация включается только на desktop (анимация в globals.css).
 */
export function AnimatedBackground() {
  return <div aria-hidden className="live-bg" />;
}
