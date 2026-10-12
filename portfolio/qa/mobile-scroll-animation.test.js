import test from 'node:test';
import assert from 'node:assert/strict';
import { DampedProgress, createMobileScrollAnimation, mobileScrollPosition } from '../src/interactions/mobile-scroll-animation.js';

test('Mobile sampling uses the live visual viewport and preserves pinch-zoom layout progress', () => {
  globalThis.window = { scrollY: 100, visualViewport: { scale: 1, pageTop: 125 } };
  assert.equal(mobileScrollPosition(), 125);
  window.visualViewport.pageTop = 140;
  assert.equal(mobileScrollPosition(), 140);
  window.visualViewport.scale = 2;
  assert.equal(mobileScrollPosition(), 100);
  delete window.visualViewport;
  assert.equal(mobileScrollPosition(), 100);
});

test('Mobile damping has the same response at 60Hz and 120Hz', () => {
  const sample = hz => {
    const progress = new DampedProgress(45, .00001);
    progress.step(0, 0);
    for (let i = 0; i < hz / 10; i++) progress.step(1, 1 / hz);
    return progress.value;
  };
  assert.ok(Math.abs(sample(60) - sample(120)) < 1e-12);
});

test('Mobile progress reverses without overshoot and converges to exact endpoints', () => {
  const progress = new DampedProgress(45, .00001);
  progress.step(0, 0);
  let previous = 0;
  for (let i = 0; i < 60; i++) {
    const value = progress.step(1, 1 / 60);
    assert.ok(value >= previous && value <= 1);
    previous = value;
  }
  assert.equal(progress.value, 1);
  for (let i = 0; i < 120; i++) {
    const value = progress.step(0, 1 / 120);
    assert.ok(value <= previous && value >= 0);
    previous = value;
  }
  assert.equal(progress.value, 0);
  assert.equal(progress.step(.75, 1 / 60, true), .75);
});

test('Mobile RAF samples live scrolling without scroll events and stops on desktop', () => {
  const media = { matches: true, addEventListener: (name, callback) => { media.change = callback; } };
  const reduced = { matches: false, addEventListener: (name, callback) => { reduced.change = callback; } };
  globalThis.window = { scrollY: 0 };
  globalThis.document = { hidden: false, addEventListener() {} };
  let next = 0;
  const frames = new Map(), rendered = [];
  globalThis.requestAnimationFrame = callback => { frames.set(++next, callback); return next; };
  globalThis.cancelAnimationFrame = id => frames.delete(id);
  const flush = time => {
    const [id, callback] = frames.entries().next().value;
    frames.delete(id); callback(time);
  };
  createMobileScrollAnimation({ media, reducedMotion: reduced,
    getTarget: y => y / 100, render: value => rendered.push(value), rate: 45, epsilon: .00001 });
  flush(0);
  window.scrollY = 100; // No scroll/touch event is dispatched.
  flush(1000 / 60); flush(2000 / 60);
  assert.ok(rendered[1] > 0 && rendered[1] < rendered[2] && rendered[2] < 1);
  reduced.matches = true; reduced.change(); flush(50);
  assert.equal(rendered.at(-1), 1);
  const count = rendered.length;
  flush(100);
  assert.equal(rendered.length, count); // Converged frames do not write transforms.
  media.matches = false; media.change();
  assert.equal(frames.size, 0);
});

test('Opt-in ME renderer writes every RAF with fractional progress; other renderers keep their existing behavior', () => {
  const media = { matches: true, addEventListener() {} };
  const reducedMotion = { matches: false, addEventListener() {} };
  globalThis.window = { scrollY: 0 };
  globalThis.document = { hidden: false, addEventListener() {} };
  let callback;
  globalThis.requestAnimationFrame = cb => { callback = cb; return 1; };
  const values = [];
  createMobileScrollAnimation({ media, reducedMotion, renderEveryFrame: true,
    getTarget: y => y / 844, render: p => values.push(p), rate: 60, epsilon: .0000001 });
  callback(0);
  callback(1000 / 120);
  assert.deepEqual(values, [0, 0]);
  window.scrollY = .125;
  callback(2000 / 120);
  assert.ok(values[2] > 0 && values[2] < .125 / 844);
  callback(3000 / 120);
  assert.ok(values[3] > values[2]);
  window.scrollY = 0;
  callback(4000 / 120);
  assert.ok(values[4] < values[3] && values[4] > 0);
});
