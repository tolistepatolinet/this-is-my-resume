import test from 'node:test';
import assert from 'node:assert/strict';

globalThis.window = { matchMedia: () => ({ matches: false }) };
const { initMadeMarquee } = await import('../src/interactions/made-marquee.js');

function gallery() {
  const listeners = new Map();
  const track = { style: {}, firstElementChild: { getBoundingClientRect: () => ({ width: 2000 }) } };
  const area = { clientHeight: 400, addEventListener: (name, callback) => listeners.set(name, callback) };
  globalThis.document = { querySelector: selector => selector === '.works-marquee' ? area : track };
  globalThis.ResizeObserver = class { observe() {} };
  globalThis.IntersectionObserver = class {
    constructor(callback) { this.callback = callback; }
    observe() { this.callback([{ isIntersecting: true }]); }
  };
  let frame;
  globalThis.requestAnimationFrame = callback => { frame = callback; };
  initMadeMarquee();
  frame(1000);
  return {
    tick: time => frame(time),
    offset: () => -Number(track.style.transform.match(/translateX\((.*)px\)/)[1]),
    wheel(delta) {
      let prevented = false;
      listeners.get('wheel')({ deltaX: delta, deltaY: 0, deltaMode: 0, ctrlKey: false,
        preventDefault() { prevented = true; } });
      assert.ok(prevented);
    },
  };
}

test('Marquee wheel momentum supports both directions, wraps and decays to base speed', () => {
  for (const direction of [1, -1]) {
    const strip = gallery();
    strip.wheel(direction * 50);
    strip.tick(1000 + 1000 / 60);
    const first = strip.offset();
    assert.ok(direction > 0 ? first > 1 : first > 1990 && first < 2000);
    for (let i = 2; i <= 180; i++) strip.tick(1000 + i * 1000 / 60);
    const before = strip.offset();
    strip.tick(1000 + 181 * 1000 / 60);
    assert.ok(Math.abs((strip.offset() - before) * 60 - 20) < .01);
  }
});

test('Marquee momentum travels equally at 60 Hz and 120 Hz', () => {
  function distance(fps) {
    const strip = gallery();
    strip.wheel(100);
    for (let i = 1; i <= fps; i++) strip.tick(1000 + i * 1000 / fps);
    return strip.offset();
  }
  assert.ok(Math.abs(distance(60) - distance(120)) < 1e-8);
});
