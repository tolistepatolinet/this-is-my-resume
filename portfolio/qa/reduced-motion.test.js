import test from 'node:test';
import assert from 'node:assert/strict';
import { motion } from '../src/interactions/config.js';

globalThis.window = { matchMedia: () => ({ matches: true }) };
const { JourneySlides } = await import('../src/interactions/journey.js');
const { initMadeMarquee } = await import('../src/interactions/made-marquee.js');

test('Reduced-motion Journey slides and boundaries settle immediately in both directions', () => {
  for (const config of [motion.journey, motion.journeyEntry, motion.journeyExit]) {
    const slides = new JourneySlides(config);
    slides.input(100, 0, 100, true);
    assert.equal(slides.animation.duration, 0);
    slides.tick(0, true);
    assert.equal(slides.position, 1);
    assert.equal(slides.animation, null);
    slides.input(-100, 1000, 100, true);
    slides.tick(1000, true);
    assert.equal(slides.position, 0);
    assert.equal(slides.animation, null);
  }
});

test('Reduced-motion gallery stops idle motion but preserves direct keyboard control', () => {
  const listeners = new Map();
  const track = { style: {}, firstElementChild: { getBoundingClientRect: () => ({ width: 2000 }) } };
  const area = { addEventListener: (name, handler) => listeners.set(name, handler) };
  globalThis.document = { querySelector: selector => selector === '.works-marquee' ? area : track };
  globalThis.ResizeObserver = class { observe() {} };
  globalThis.IntersectionObserver = class {
    constructor(callback) { this.callback = callback; }
    observe() { this.callback([{ isIntersecting: true }]); }
  };
  let frame;
  globalThis.requestAnimationFrame = callback => { frame = callback; };
  initMadeMarquee();
  const initial = track.style.transform;
  for (let time = 100; time <= 1000; time += 100) frame(time);
  assert.equal(track.style.transform, initial);
  let prevented = false;
  listeners.get('keydown')({ key: 'ArrowRight', preventDefault() { prevented = true; } });
  assert.equal(prevented, true);
  assert.notEqual(track.style.transform, initial);
  const manual = track.style.transform;
  frame(1100); frame(1200);
  assert.equal(track.style.transform, manual);
});
