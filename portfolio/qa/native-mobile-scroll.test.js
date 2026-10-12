import test from 'node:test';
import assert from 'node:assert/strict';
import { createNativeMobileScroll } from '../src/interactions/native-mobile-scroll.js';

function harness(supported = true) {
  const media = { matches: true, addEventListener: (_, handler) => { media.change = handler; } };
  const reduced = { matches: false, addEventListener: (_, handler) => { reduced.change = handler; } };
  globalThis.document = { scrollingElement: {} };
  globalThis.window = supported ? {
    ScrollTimeline: class { constructor(options) { this.options = options; } },
    Animation: class {}, CSS: { supports: () => true },
  } : {};
  if (supported) window.Animation.prototype.rangeStart = 'normal';
  const calls = [], elements = [];
  const tracks = Array.from({ length: 4 }, (_, index) => {
    const element = {
      driver: null,
      setAttribute(_, value) { this.driver = value; },
      animate(frames, options) {
        const animation = { cancelled: false, cancel() { this.cancelled = true; } };
        calls.push({ index, frames, options, animation });
        return animation;
      },
    };
    elements.push(element);
    return { element, frames: [{ transform: 'translate3d(0, 0, 0)' }, { transform: `translate3d(${index}px, 10px, 0)` }] };
  });
  const controller = createNativeMobileScroll({ media, reducedMotion: reduced });
  const definition = { start: 0, end: 844, tracks };
  return { media, reduced, calls, elements, controller, definition };
}

test('Hero native effects share one timeline and the exact pixel scroll range', () => {
  const h = harness();
  h.controller.refresh(h.definition);
  assert.equal(h.controller.active(), true);
  assert.equal(h.calls.length, 4);
  for (const call of h.calls) {
    assert.equal(call.options.timeline, h.calls[0].options.timeline);
    assert.equal(call.options.rangeStart, '0px');
    assert.equal(call.options.rangeEnd, '844px');
    assert.equal(call.options.easing, 'linear');
    assert.equal(call.options.fill, 'both');
  }
  h.controller.refresh(h.definition);
  assert.equal(h.calls.length, 4); // Stable measurements never restart effects.
  h.media.matches = false; h.media.change();
  assert.equal(h.controller.active(), false);
  assert.ok(h.calls.every(call => call.animation.cancelled));
});

test('Unsupported browsers and reduced motion retain the non-native path', () => {
  const unsupported = harness(false);
  unsupported.controller.refresh(unsupported.definition);
  assert.equal(unsupported.controller.active(), false);
  assert.equal(unsupported.calls.length, 0);
  assert.ok(unsupported.elements.every(element => element.driver === 'raf'));
  const h = harness();
  h.controller.refresh(h.definition);
  h.reduced.matches = true; h.reduced.change();
  assert.equal(h.controller.active(), false);
  assert.ok(h.calls.every(call => call.animation.cancelled));
  assert.ok(h.elements.every(element => element.driver === 'reduced'));
});

test('A rejected native effect cancels the partial group so fallback can own all elements', () => {
  const h = harness();
  h.elements[1].animate = () => { throw new Error('Unsupported attachment range'); };
  h.controller.refresh(h.definition);
  assert.equal(h.controller.active(), false);
  assert.equal(h.calls.length, 1);
  assert.equal(h.calls[0].animation.cancelled, true);
  assert.ok(h.elements.every(element => element.driver === 'raf'));
});
