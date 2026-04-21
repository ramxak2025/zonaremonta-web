/**
 * Живой фон: конический градиент вращается (анимация hue),
 * плюс 3 пульсирующих orbs плавают поверх. Всё полностью CSS, GPU-layer.
 */
export function AnimatedBackground() {
  return (
    <div aria-hidden className="live-bg">
      <span className="live-bg-orb live-bg-orb-1" />
      <span className="live-bg-orb live-bg-orb-2" />
      <span className="live-bg-orb live-bg-orb-3" />
    </div>
  );
}
