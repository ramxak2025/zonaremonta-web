export function AnimatedBackground() {
  return (
    <div
      aria-hidden
      className="fixed inset-0 pointer-events-none overflow-hidden z-0"
      style={{
        background:
          'linear-gradient(180deg, #15151F 0%, #0F0F18 100%)',
      }}
    >
      <span className="bg-orb bg-orb-red" />
      <span className="bg-orb bg-orb-violet" />
      <span className="bg-orb bg-orb-crimson" />
      <span className="bg-orb bg-orb-blue" />
    </div>
  );
}
