import { motion } from './config.js';
import { documentTop, reducedMotion } from './scroll.js';
import { mobileHeroQuery } from './mobile-header.js';

// This vertical boundary uses the same motion model as the horizontal slides,
// without changing the internal slide configuration or any section geometry.
export function initJourneyEntry(scroll, internalSlides, Slides) {
  return initBoundary(scroll, internalSlides, Slides, motion.journeyEntry, 0, () => [
    documentTop(document.querySelector('.about')),
    documentTop(document.querySelector('.journey')),
  ]);
}

export function initJourneyExit(scroll, internalSlides, Slides) {
  return initBoundary(scroll, internalSlides, Slides, motion.journeyExit, 2, () => {
    const journey = document.querySelector('.journey');
    return [documentTop(journey) + journey.offsetHeight - document.querySelector('.journey-stage').offsetHeight,
      documentTop(document.querySelector('.made-works'))];
  });
}

function initBoundary(scroll, internalSlides, Slides, config, slideIndex, measureBounds) {
  const mobile = window.matchMedia(mobileHeroQuery);
  const entry = new Slides(config);
  let lowerTop, upperTop, height, origin, controlling = false, settledAt = null;

  function begin(direction) {
    origin = direction > 0 ? window.scrollY : lowerTop;
    entry.reset(direction > 0 ? 0 : 1);
    // Normally the span is one viewport. Preserve continuity if About is
    // already slightly scrolled when this wheel gesture first reaches the gate.
    entry.config = { ...config,
      preview: Math.min(1, height * config.preview / Math.max(1, upperTop - origin)) };
    controlling = true;
    settledAt = null;
    internalSlides.reset(slideIndex);
  }

  function handle(delta, event) {
    if (mobile.matches) return;
    if (!controlling) {
      const y = window.scrollY;
      const gestureQuiet = performance.now() - internalSlides.lastInput > config.gestureIdle;
      const entering = delta > 0 && y >= lowerTop && y < upperTop &&
        (slideIndex === 0 || internalSlides.position === slideIndex && !internalSlides.animation && gestureQuiet);
      const returning = delta < 0 && Math.abs(y - upperTop) < 1 &&
        internalSlides.position === slideIndex && !internalSlides.animation;
      if (!entering && !returning) return;
      begin(entering ? 1 : -1);
    }
    event.preventDefault();
    // Boundary ownership takes precedence over stale element-level wheel targets.
    event.stopPropagation();
    const time = performance.now();
    // Residual input at either completed endpoint cannot create a third state
    // in this two-stop vertical boundary while the settle guard is still active.
    if (!entry.animation && entry.position === entry.index &&
        (entry.index === 1 && delta > 0 || entry.index === 0 && delta < 0)) {
      entry.lastInput = time;
      return;
    }
    entry.input(delta, time, height * config.thresholdViewports, reducedMotion.matches);
  }

  window.addEventListener('wheel', event => {
    if (event.ctrlKey || event.defaultPrevented) return;
    const units = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? height : 1;
    const delta = (Math.abs(event.deltaY) >= Math.abs(event.deltaX) ? event.deltaY : event.deltaX) * units;
    if (delta) handle(delta, event);
  }, { passive: false, capture: true });
  window.addEventListener('keydown', event => {
    if (event.defaultPrevented || event.target.closest('a,button,input,textarea,select,[contenteditable]')) return;
    const direction = { ArrowDown: 1, ArrowUp: -1, PageDown: 1, PageUp: -1, ' ': event.shiftKey ? -1 : 1 }[event.key];
    if (direction) handle(direction * height * config.thresholdViewports, event);
  });
  scroll.add({
    measure() {
      [lowerTop, upperTop] = measureBounds();
      height = window.innerHeight;
    },
    update(y) {
      // Explicit navigation outside this boundary cancels its local controller.
      if (controlling && (y < Math.min(origin, lowerTop) - 1 || y > upperTop + 1)) controlling = false;
    },
  });
  function tick(time) {
    if (mobile.matches) controlling = false;
    if (controlling) {
      entry.tick(time, reducedMotion.matches);
      window.scrollTo({ top: origin + (upperTop - origin) * entry.position, behavior: 'instant' });
      if (!entry.animation && entry.position === entry.index) settledAt ??= time;
      else settledAt = null;
      if (settledAt !== null && time - settledAt >= config.settleGuard && time - entry.lastInput > config.gestureIdle) {
        controlling = false;
      }
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
  return {
    ownsScroll: () => controlling,
    cancel() { controlling = false; settledAt = null; entry.reset(0); },
  };
}
