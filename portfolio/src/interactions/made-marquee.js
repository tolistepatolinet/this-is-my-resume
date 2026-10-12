import { motion } from './config.js';
import { reducedMotion } from './scroll.js';
import { mobileHeroQuery } from './mobile-header.js';
import { MobileMadeInertia, mobileMadeMotion } from './mobile-made-motion.js';

export function initMadeMarquee() {
  const area = document.querySelector('.works-marquee');
  const track = document.querySelector('.works-track');
  const sequence = track.firstElementChild;
  const baseVelocity = motion.marquee.speed;
  const mobile = window.matchMedia(mobileHeroQuery);
  const mobileInertia = new MobileMadeInertia();
  // Friction is calibrated per frame at 60 Hz, then applied by elapsed time.
  const decayRate = -Math.log(motion.marquee.friction) * 60;
  let width = 0, offset = 0, lastTime = 0, userVelocity = 0, visible = false;
  let touchX = null, touchY = null;
  let touchStartX = null, touchStartY = null, touchAxis = null;
  let touchStartTime = 0;
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
    } else if (mobile.matches) {
      mobileInertia.addVelocity(delta);
    } else {
      userVelocity += delta * motion.marquee.velocityGain;
    }
  }
  area.addEventListener('wheel', event => {
    if (event.ctrlKey) return; // Preserve browser pinch-to-zoom.
    if (mobile.matches && Math.abs(event.deltaY) >= Math.abs(event.deltaX)) return;
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
    if (mobile.matches && event.touches.length !== 1) return;
    touchX = event.touches[0].clientX;
    touchY = event.touches[0].clientY;
    if (mobile.matches) { touchStartX = touchX; touchStartY = touchY; touchAxis = null; touchStartTime = performance.now(); }
  }, { passive: true });
  area.addEventListener('touchmove', event => {
    if (touchX === null) return;
    const x = event.touches[0].clientX, y = event.touches[0].clientY;
    if (mobile.matches) {
      if (event.touches.length !== 1) return;
      if (!touchAxis) {
        const dx = Math.abs(x - touchStartX), dy = Math.abs(y - touchStartY);
        if (Math.max(dx, dy) < mobileMadeMotion.gestureThreshold) return;
        touchAxis = dx > dy ? 'horizontal' : 'vertical';
        if (touchAxis === 'horizontal') mobileInertia.start(touchStartTime);
      }
      if (touchAxis === 'horizontal') {
        if (event.cancelable) event.preventDefault();
        offset += reducedMotion.matches ? (touchX - x) * mobileMadeMotion.dragSensitivity : mobileInertia.drag(touchX - x, performance.now());
        render();
      }
      touchX = x; touchY = y;
      return;
    }
    if (Math.abs(x - touchX) > Math.abs(y - touchY)) {
      if (event.cancelable) event.preventDefault();
      manual(touchX - x);
    }
    touchX = x; touchY = y;
  }, { passive: false });
  function endTouch() {
    if (mobile.matches) mobileInertia.end(performance.now());
    touchX = touchY = touchStartX = touchStartY = touchAxis = null;
  }
  area.addEventListener('touchend', endTouch);
  area.addEventListener('touchcancel', endTouch);
  new ResizeObserver(measure).observe(sequence);
  new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }).observe(area);
  // Time-based travel is independent of refresh rate. Offscreen work is skipped.
  function tick(time) {
    const elapsed = lastTime ? Math.min(time - lastTime, 100) / 1000 : 0;
    lastTime = time;
    const decay = Math.exp(-decayRate * elapsed);
    const mobileTravel = mobile.matches && !reducedMotion.matches ? mobileInertia.step(elapsed) : 0;
    if (visible && !reducedMotion.matches) {
      // Integrate the decaying velocity so inertia feels the same at any refresh rate.
      offset += mobile.matches ? mobileTravel : baseVelocity * elapsed + userVelocity * (1 - decay) / decayRate;
      render();
    }
    userVelocity = reducedMotion.matches ? 0 : userVelocity * decay;
    if (reducedMotion.matches) mobileInertia.velocity = 0;
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
  measure();
}
