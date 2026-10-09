import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { journeyPanels } from '../src/data/journey.js';
import { tracks, works } from '../src/data/made.js';

// MatchMedia is the only browser dependency of the pure scroll mapping.
globalThis.window = { matchMedia: () => ({ matches: false }) };
const { journeyProgress } = await import('../src/interactions/journey.js');

test('Journey settles at complete panels, clamps its endpoints and releases at panel 03', () => {
  for (const [input, expected] of [[-1, 0], [0, 0], [.5, 1], [1, 2], [2, 2]]) {
    assert.equal(journeyProgress(input), expected);
  }
  assert.equal(journeyProgress(.03), 0);
  assert.equal(journeyProgress(.48), 1);
  assert.equal(journeyProgress(.53), 1);
  assert.equal(journeyProgress(.98), 2);
});

test('Journey resistance remains monotonic without bounce; reduced motion removes the easing', () => {
  let previous = 0;
  for (let i = 0; i <= 1000; i++) {
    const current = journeyProgress(i / 1000);
    assert.ok(current >= previous && current <= 2);
    previous = current;
  }
  assert.ok(journeyProgress(.25) < journeyProgress(.25, true));
  assert.equal(journeyProgress(.5, true), 1);
});

test('Every mapped asset exists and its public copy is unchanged', async () => {
  const paths = [...journeyPanels.map(p => p.image), ...works.map(w => w.src), ...tracks.flatMap(t => [t.cover, t.audio]),
    '/assets/hero/me.png', '/assets/about/arrow.png', '/assets/made/laptop.png', '/assets/made/player.png',
    '/assets/connect/hand.png', '/assets/connect/phone.png',
    '/assets/fonts/arial-black/Arial-Black.woff', '/assets/fonts/cascadia/CascadiaMono-Regular.woff2', '/assets/fonts/cascadia/CascadiaMono-Bold.woff2'];
  assert.equal(paths.length, 28);
  for (const path of paths) {
    const source = await readFile(new URL(`..${path}`, import.meta.url));
    const published = await readFile(new URL(`../public${path}`, import.meta.url));
    assert.ok(source.equals(published), path);
  }
});

test('Five tracks have distinct sources and the confirmed title mapping', () => {
  assert.equal(tracks.length, 5);
  assert.equal(new Set(tracks.map(t => t.audio)).size, 5);
  assert.deepEqual(tracks.map(t => t.title), [
    'Moosham - Я.mp3', 'Cathou, Moosham - Я так дышу (alternative version).mp3',
    'Moosham, Cathou - Хамелеон.mp3', 'Moosham - Accidentally.mp3', 'Moosham, lera blvmrkv - Солнце.mp3',
  ]);
});
