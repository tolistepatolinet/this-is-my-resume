import test from 'node:test';
import assert from 'node:assert/strict';
import { initMobileJourneyComposition } from '../src/interactions/mobile-journey.js';

test('Mobile Journey preserves layout measurements without installing input or scroll controls', () => {
  const forbidden = () => { throw new Error('Mobile Journey must not capture input or write scroll position'); };
  const media = { matches: true };
  globalThis.window = { matchMedia: () => media, addEventListener: forbidden, scrollTo: forbidden };
  globalThis.requestAnimationFrame = forbidden;
  const values = new Map();
  const panels = [140, 180, 200].map(height => ({ querySelector: selector => ({ getBoundingClientRect: () => ({ height: selector === '.journey-heading' ? 116 : height }) }) }));
  globalThis.document = { addEventListener: forbidden, querySelectorAll: () => panels, documentElement: { style: { setProperty: (name, value) => values.set(name, value) } } };
  let client;
  initMobileJourneyComposition({ add: item => { client = item; } });
  client.measure(); client.update(1500); client.update(5000); client.update(1000);
  assert.equal(values.get('--mobile-journey-heading-height'), '116px');
  assert.equal(values.get('--mobile-journey-shortest-body-height'), '140px');
  media.matches = false;
  values.clear(); client.measure();
  assert.equal(values.size, 0);
});
