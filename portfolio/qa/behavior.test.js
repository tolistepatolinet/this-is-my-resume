import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { journeyPanels } from '../src/data/journey.js';
import { tracks, works } from '../src/data/made.js';
import { motion } from '../src/interactions/config.js';

// MatchMedia is the only browser dependency of the pure scroll mapping.
globalThis.window = { matchMedia: () => ({ matches: false }) };
const { JourneySlides } = await import('../src/interactions/journey.js');

test('Journey previews one neighbor and completes at exact full-panel boundaries', () => {
  const slides = new JourneySlides();
  slides.input(50, 0, 100);
  assert.ok(slides.position > 0 && slides.position < .05);
  slides.input(50, 20, 100);
  assert.equal(slides.position, .05);
  let previous = slides.position;
  for (let t = 20; t <= 670; t += 10) {
    slides.tick(t);
    assert.ok(slides.position >= previous && slides.position <= 1);
    previous = slides.position;
  }
  assert.equal(slides.position, 1);
  slides.input(100, 1000, 100);
  slides.tick(1650);
  assert.equal(slides.position, 2);
  slides.input(-100, 2000, 100);
  slides.tick(2650);
  assert.equal(slides.position, 1);
  slides.input(-100, 3000, 100);
  slides.tick(3650);
  assert.equal(slides.position, 0);
});

test('Journey returns an abandoned preview and cannot skip a slide during one gesture', () => {
  const slides = new JourneySlides();
  slides.input(40, 0, 100);
  slides.tick(180);
  slides.tick(400);
  assert.equal(slides.position, 0);
  slides.input(1000, 1000, 100);
  for (let t = 1020; t <= 2000; t += 20) {
    slides.input(1000, t, 100);
    slides.tick(t);
  }
  assert.equal(slides.position, 1);
  slides.input(100, 2300, 100, true);
  slides.tick(2300, true);
  assert.equal(slides.position, 2);
});

test('About entry uses a five-percent preview, settles on Journey 01 and reverses to About', () => {
  const entry = new JourneySlides(motion.journeyEntry);
  entry.input(100, 0, 100);
  assert.equal(entry.position, .05);
  for (let t = 10; t <= 900; t += 10) {
    entry.input(1000, t, 100);
    entry.tick(t);
    assert.ok(entry.position >= 0 && entry.position <= 1);
  }
  assert.equal(entry.position, 1);
  entry.input(-100, 1200, 100);
  assert.equal(entry.position, .95);
  entry.tick(1850);
  assert.equal(entry.position, 0);
});

test('Journey boundary thresholds are twenty percent stronger and retain the same preview', () => {
  for (const config of [motion.journeyEntry, motion.journeyExit]) {
    assert.equal(config.thresholdViewports, motion.journey.thresholdViewports * 1.2);
    assert.equal(config.preview, motion.journey.preview);
    const boundary = new JourneySlides(config);
    boundary.input(160, 0, 1000 * config.thresholdViewports);
    assert.equal(boundary.animation, null);
    assert.ok(boundary.position > 0 && boundary.position < .05);
    boundary.input(32, 20, 1000 * config.thresholdViewports);
    boundary.tick(20 + config.completionDuration);
    assert.equal(boundary.position, 1);
    boundary.input(-192, 1000, 1000 * config.thresholdViewports);
    boundary.tick(1000 + config.completionDuration);
    assert.equal(boundary.position, 0);
  }
});

test('Every mapped asset exists and its public copy is unchanged', async () => {
  const paths = [...journeyPanels.map(p => p.image), ...works.map(w => w.src), ...tracks.flatMap(t => [t.cover, t.audio]),
    '/assets/hero/me.png', '/assets/about/arrow.png', '/assets/made/laptop.png', '/assets/made/player.png',
    '/assets/connect/hand.png', '/assets/connect/phone.png',
    '/assets/fonts/montserrat/Montserrat-Black.woff2', '/assets/fonts/cascadia/CascadiaMono-Regular.woff2', '/assets/fonts/cascadia/CascadiaMono-Bold.woff2'];
  assert.equal(paths.length, 28);
  for (const path of paths) {
    const sourcePath = path.replace('/fonts/montserrat/', '/fonts/montserrat-black/');
    const source = await readFile(new URL(`..${sourcePath}`, import.meta.url));
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
