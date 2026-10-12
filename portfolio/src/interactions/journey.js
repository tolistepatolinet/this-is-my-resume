import { motion } from './config.js';
import { clamp, reducedMotion, documentTop } from './scroll.js';
import { initJourneyEntry, initJourneyExit } from './journey-entry.js';
import { mobileHeroQuery } from './mobile-header.js';

// Gesture latching allows exactly one neighboring slide per continuous gesture.
export class JourneySlides {
  constructor(config = motion.journey) { this.config = config; this.reset(0); }
  reset(index) {
    this.index = this.position = clamp(Math.round(index), 0, 2);
    this.inputDistance = 0; this.lastInput = -Infinity;
    this.locked = false; this.animation = null;
  }
  input(delta, time, threshold, reduce = false) {
    if (time - this.lastInput > this.config.gestureIdle && !this.animation) this.locked = false;
    this.lastInput = time;
    if (this.locked || this.animation) return;
    this.inputDistance += delta;
    const direction = Math.sign(this.inputDistance);
    if (this.index + direction < 0 || this.index + direction > 2) {
      this.inputDistance = 0; return;
    }
    const progress = clamp(Math.abs(this.inputDistance) / threshold);
    this.position = this.index + direction * this.config.preview * progress ** this.config.resistancePower;
    if (progress === 1) this.complete(this.index + direction, time, reduce ? 0 : this.config.completionDuration);
  }
  complete(target, time, duration) {
    this.animation = { from: this.position, target, time, duration };
    this.locked = true; this.inputDistance = 0;
  }
  tick(time, reduce = false) {
    if (!this.animation && this.position !== this.index && time - this.lastInput >= this.config.gestureIdle) {
      this.complete(this.index, time, reduce ? 0 : this.config.previewReturnDuration);
    }
    if (!this.animation) return false;
    const a = this.animation;
    const p = a.duration ? clamp((time - a.time) / a.duration) : 1;
    const eased = this.config.completionEasing === 'smoothstep' ? p * p * (3 - 2 * p) : p;
    this.position = a.from + (a.target - a.from) * eased;
    if (p < 1) return false;
    this.index = this.position = a.target; this.animation = null;
    return true;
  }
}

export function initJourney(scroll) {
  const mobile = window.matchMedia(mobileHeroQuery);
  const section = document.querySelector('.journey');
  const stage = document.querySelector('.journey-stage');
  const track = document.querySelector('.journey-track');
  const slides = new JourneySlides();
  const entry = initJourneyEntry(scroll, slides, JourneySlides);
  const exit = initJourneyExit(scroll, slides, JourneySlides);
  const boundaryOwnsScroll = () => entry.ownsScroll() || exit.ownsScroll();
  let top, length, width, height, previousY = window.scrollY, internalY = null;
  const render = () => { if (!mobile.matches && width) track.style.transform = `translateX(${-slides.position * width}px)`; };
  const pinned = () => !mobile.matches && window.scrollY >= top && window.scrollY <= top + length;
  function anchor() {
    internalY = top + slides.index * length / 2;
    window.scrollTo({ top: internalY, behavior: 'instant' });
  }
  function consume(delta) {
    slides.input(delta, performance.now(), height * motion.journey.thresholdViewports, reducedMotion.matches);
    render();
  }
  function shouldConsume(delta) {
    if (!pinned()) return false;
    if (slides.animation || slides.locked && performance.now() - slides.lastInput <= motion.journey.gestureIdle) return true;
    return !(slides.index === 0 && delta < 0 || slides.index === 2 && delta > 0);
  }
  document.querySelectorAll('body > .site-header a[href="#journey"], .mobile-header a[href="#journey"]').forEach(link => link.addEventListener('click', event => {
    if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    entry.cancel(); exit.cancel();
    slides.reset(0);
    // Let the native anchor navigate normally, but distinguish its destination
    // from natural upward entry, which must still start on the last slide.
    internalY = previousY = documentTop(section);
    render();
  }));
  // Claim pinned scroll before any element-level wheel handler can consume it.
  // Ownership depends only on scroll geometry, never the pointer's hit target.
  window.addEventListener('wheel', event => {
    if (event.ctrlKey || event.defaultPrevented || boundaryOwnsScroll()) return;
    const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? height : 1;
    const delta = (Math.abs(event.deltaY) >= Math.abs(event.deltaX) ? event.deltaY : event.deltaX) * unit;
    if (!delta || !shouldConsume(delta)) return;
    event.preventDefault(); event.stopPropagation(); consume(delta);
  }, { passive: false, capture: true });
  window.addEventListener('keydown', event => {
    if (event.defaultPrevented || boundaryOwnsScroll()) return;
    if (event.target.closest('a,button,input,textarea,select,[contenteditable]')) return;
    const directions = { ArrowDown: 1, ArrowUp: -1, PageDown: 1, PageUp: -1, ' ': event.shiftKey ? -1 : 1 };
    const direction = directions[event.key];
    if (!direction || !shouldConsume(direction)) return;
    event.preventDefault(); consume(direction * height * motion.journey.thresholdViewports);
  });
  scroll.add({
    measure() {
      top = documentTop(section);
      length = section.offsetHeight - stage.offsetHeight;
      width = stage.clientWidth; height = stage.offsetHeight;
    },
    update(scrollY) {
      if (mobile.matches) { previousY = scrollY; internalY = null; return; }
      if (boundaryOwnsScroll()) { previousY = scrollY; render(); return; }
      if (internalY !== null && Math.abs(scrollY - internalY) < 1) internalY = null;
      else if (scrollY !== previousY && scrollY >= top && scrollY <= top + length) {
        const entered = previousY < top || previousY > top + length;
        if (entered) slides.reset(previousY < top ? 0 : 2);
        else consume(scrollY - previousY);
      }
      if (scrollY < top) slides.reset(0);
      else if (scrollY > top + length) slides.reset(2);
      previousY = scrollY; render();
    },
  });
  function tick(time) {
    if (!mobile.matches && slides.tick(time, reducedMotion.matches) && pinned()) anchor();
    render(); requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
