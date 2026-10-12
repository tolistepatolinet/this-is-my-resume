// Exponential damping has the same response at 60Hz and 120Hz. Exact snapping
// only occurs after the remaining progress error is visually imperceptible.
export class DampedProgress {
  constructor(rate, epsilon) {
    this.rate = rate;
    this.epsilon = epsilon;
    this.value = null;
  }
  step(target, seconds, immediate = false) {
    if (this.value === null || immediate) this.value = target;
    else this.value += (target - this.value) * -Math.expm1(-this.rate * seconds);
    if (Math.abs(target - this.value) <= this.epsilon) this.value = target;
    return this.value;
  }
}

export function mobileScrollPosition() {
  const viewport = window.visualViewport;
  // At normal zoom this is the document position of the actual visual viewport.
  // Keep pinch zoom independent of the approved layout-scroll animation ranges.
  return viewport?.scale === 1 && Number.isFinite(viewport.pageTop)
    ? viewport.pageTop : window.scrollY;
}

export function createMobileScrollAnimation({ media, reducedMotion, getTarget, render, rate, epsilon, isNative = () => false, renderEveryFrame = false }) {
  const progress = new DampedProgress(rate, epsilon);
  let frame = null, previousTime = null, rendered = null;
  function schedule() {
    if (frame === null && media.matches && !document.hidden && !isNative()) frame = requestAnimationFrame(tick);
  }
  function tick(time) {
    frame = null;
    if (!media.matches || document.hidden || isNative()) return;
    const seconds = previousTime === null ? 1 / 60 : Math.max(0, (time - previousTime) / 1000);
    previousTime = time;
    // Sample the live viewport on EVERY mobile animation frame. A scroll-event
    // payload is never the source of truth, including during native momentum.
    const target = getTarget(mobileScrollPosition());
    if (target !== null) {
      const value = progress.step(target, seconds, reducedMotion.matches);
      if (renderEveryFrame || value !== rendered) {
        render(value);
        rendered = value;
      }
    }
    // Keep this lightweight sampler alive while mobile is visible, even at
    // rest, so delayed/missing Safari scroll events cannot stall the animation.
    // Converged frames skip all visual writes. Desktop never runs this loop.
    schedule();
  }
  function resume() {
    if (frame !== null) cancelAnimationFrame(frame);
    frame = previousTime = rendered = null;
    if (!media.matches) progress.value = null;
    schedule();
  }
  media.addEventListener('change', resume);
  document.addEventListener('visibilitychange', resume);
  reducedMotion.addEventListener('change', () => { rendered = null; schedule(); });
  schedule();
  return { refresh() { rendered = null; schedule(); } };
}
