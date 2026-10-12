import { listenForLayoutResize } from './layout-resize.js';
export const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
export const lerp = (start, end, progress) => start + (end - start) * progress;
export const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

// Measure only when layout changes; scroll frames read scrollY and write transforms.
export function createScrollController() {
  const clients = [];
  let frame = 0;
  let needsMeasure = true;
  function update() {
    frame = 0;
    if (needsMeasure) {
      clients.forEach(client => client.measure());
      needsMeasure = false;
    }
    clients.forEach(client => client.update(window.scrollY));
  }
  function request(measure = false) {
    needsMeasure ||= measure;
    if (!frame) frame = requestAnimationFrame(update);
  }
  window.addEventListener('scroll', () => request(), { passive: true });
  listenForLayoutResize(() => request(true));
  window.addEventListener('pageshow', () => request(true));
  reducedMotion.addEventListener('change', () => request(true));
  document.fonts.ready.then(() => request(true));
  return {
    add(client) { clients.push(client); request(true); },
    refresh() { request(true); },
  };
}

export function documentTop(element) {
  return element.getBoundingClientRect().top + window.scrollY;
}
