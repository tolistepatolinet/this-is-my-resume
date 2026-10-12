// Mobile browser chrome changes viewport height during a gesture. It must not
// restart scroll timelines or clear artwork transforms. Width/orientation
// changes still invalidate geometry; desktop retains its existing resize path.
export function listenForLayoutResize(measure, target = window) {
  let width = target.innerWidth;
  const resize = () => {
    const nextWidth = target.innerWidth;
    const chromeOnly = nextWidth <= 768 && nextWidth === width;
    width = nextWidth;
    if (!chromeOnly) measure();
  };
  target.addEventListener('resize', resize, { passive: true });
  target.addEventListener('orientationchange', measure, { passive: true });
}
