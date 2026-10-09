import { motion } from './config.js';
import { reducedMotion } from './scroll.js';

export function initMadeMarquee() {
  const area = document.querySelector('.works-marquee');
  const track = document.querySelector('.works-track');
  const sequence = track.firstElementChild;
  const baseVelocity = motion.marquee.speed;
  // Friction is calibrated per frame at 60 Hz, then applied by elapsed time.
  const decayRate = -Math.log(motion.marquee.friction) * 60;
  let width = 0, offset = 0, lastTime = 0, userVelocity = 0, visible = false;
  let touchX = null, touchY = null;
  function measure() { width = sequence.getBoundingClientRect().width; render(); }
  function render() {
    if (!width) return;
    offset = ((offset % width) + width) % width;
    track.style.transform = `translateX(${-offset}px)`;
  }
  function manual(delta) {
    if (reducedMotion.matches) {
      userVelocity = 0;
      offset += delta;
      render();
    } else {
      userVelocity += delta * motion.marquee.velocityGain;
    }
  }
  area.addEventListener('wheel', event => {
    if (event.ctrlKey) return; // Preserve browser pinch-to-zoom.
    event.preventDefault();
    const units = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? area.clientHeight : 1;
    const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
    manual(delta * units * motion.marquee.wheelSensitivity);
  }, { passive: false });
  area.addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    manual((event.key === 'ArrowRight' ? 1 : -1) * motion.marquee.keyboardStep);
  });
  area.addEventListener('touchstart', event => {
    touchX = event.touches[0].clientX;
    touchY = event.touches[0].clientY;
  }, { passive: true });
  area.addEventListener('touchmove', event => {
    if (touchX === null) return;
    const x = event.touches[0].clientX, y = event.touches[0].clientY;
    if (Math.abs(x - touchX) > Math.abs(y - touchY)) {
      if (event.cancelable) event.preventDefault();
      manual(touchX - x);
    }
    touchX = x; touchY = y;
  }, { passive: false });
  area.addEventListener('touchend', () => { touchX = touchY = null; });
  new ResizeObserver(measure).observe(sequence);
  new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }).observe(area);
  // Time-based travel is independent of refresh rate. Offscreen work is skipped.
  function tick(time) {
    const elapsed = lastTime ? Math.min(time - lastTime, 100) / 1000 : 0;
    lastTime = time;
    const decay = Math.exp(-decayRate * elapsed);
    if (visible && !reducedMotion.matches) {
      // Integrate the decaying velocity so inertia feels the same at any refresh rate.
      offset += baseVelocity * elapsed + userVelocity * (1 - decay) / decayRate;
      render();
    }
    userVelocity = reducedMotion.matches ? 0 : userVelocity * decay;
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
  measure();
}
