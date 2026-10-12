import test from 'node:test';
import assert from 'node:assert/strict';
import { MobileMadeInertia, mobileMadeMotion } from '../src/interactions/mobile-made-motion.js';

test('Mobile works drag follows the finger, carries both directions, and decays into idle', () => {
  for (const direction of [1, -1]) {
    const motion = new MobileMadeInertia();
    motion.start(0);
    assert.equal(motion.drag(direction * 40, 40), direction * 40);
    motion.step(.04); motion.end(40);
    const first = motion.step(1 / 60);
    assert.equal(Math.sign(first), direction);
    let previous = Math.abs(motion.velocity);
    for (let i = 0; i < 600; i++) {
      motion.step(1 / 60);
      assert.ok(Math.abs(motion.velocity) <= previous);
      previous = Math.abs(motion.velocity);
    }
    assert.ok(Math.abs(motion.step(1 / 60) * 60 - mobileMadeMotion.idleSpeed) < .001);
  }
});

test('Holding a mobile drag before release naturally damps stale momentum', () => {
  const motion = new MobileMadeInertia();
  motion.start(0); motion.drag(50, 50);
  const before = motion.velocity;
  motion.end(2050);
  assert.ok(motion.velocity < before * .001);
});

test('Mobile gallery wiring follows horizontal touch and leaves vertical touch to the page', async () => {
  globalThis.window = { matchMedia: query => ({ matches: query === '(max-width: 768px)' }) };
  const { initMadeMarquee } = await import('../src/interactions/made-marquee.js');
  const listeners = new Map();
  const track = { style: {}, firstElementChild: { getBoundingClientRect: () => ({ width: 2000 }) } };
  const area = { addEventListener: (name, callback) => listeners.set(name, callback) };
  globalThis.document = { querySelector: selector => selector === '.works-marquee' ? area : track };
  globalThis.ResizeObserver = class { observe() {} };
  globalThis.IntersectionObserver = class { constructor(callback) { this.callback = callback; } observe() { this.callback([{ isIntersecting: true }]); } };
  let frame;
  globalThis.requestAnimationFrame = callback => { frame = callback; };
  initMadeMarquee();
  const event = (x, y) => ({ touches: [{ clientX: x, clientY: y }], cancelable: true, prevented: false, preventDefault() { this.prevented = true; } });
  listeners.get('touchstart')(event(100, 100));
  const horizontal = event(70, 101);
  listeners.get('touchmove')(horizontal);
  assert.equal(horizontal.prevented, true);
  assert.equal(track.style.transform, 'translateX(-30px)');
  listeners.get('touchend')();
  frame(1000); frame(1016);
  assert.ok(-Number(track.style.transform.match(/translateX\((.*)px\)/)[1]) > 30);
  const before = track.style.transform;
  listeners.get('touchstart')(event(100, 100));
  const vertical = event(101, 50);
  listeners.get('touchmove')(vertical);
  assert.equal(vertical.prevented, false);
  assert.equal(track.style.transform, before);
});
