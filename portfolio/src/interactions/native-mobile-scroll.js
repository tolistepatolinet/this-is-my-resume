// Use the browser's scroll timeline, including threaded updates on supporting
// WebKit builds. Unsupported browsers retain the existing RAF/damping fallback.
export function createNativeMobileScroll({ media, reducedMotion }) {
  let animations = [], definition = null, signature = null;
  const supported = typeof window.ScrollTimeline === 'function' &&
    typeof window.Animation === 'function' && 'rangeStart' in window.Animation.prototype &&
    window.CSS?.supports('animation-timeline', 'scroll()');
  function stop() {
    animations.forEach(animation => animation.cancel());
    animations = [];
    signature = null;
  }
  function refresh(next = definition) {
    definition = next;
    if (!next) return;
    const { tracks, start, end } = next;
    if (!supported || !media.matches || reducedMotion.matches) {
      stop();
      tracks.forEach(({ element }) => element.setAttribute('data-mobile-scroll-driver',
        !media.matches ? 'desktop' : reducedMotion.matches ? 'reduced' : 'raf'));
      return;
    }
    const key = JSON.stringify([start, end, tracks.map(track => track.frames)]);
    if (key === signature) return;
    stop();
    try {
      const timeline = new window.ScrollTimeline({ source: document.scrollingElement, axis: 'block' });
      for (const { element, frames } of tracks) {
        animations.push(element.animate(frames, { timeline, duration: 'auto',
          rangeStart: `${start}px`, rangeEnd: `${end}px`, easing: 'linear', fill: 'both' }));
        element.setAttribute('data-mobile-scroll-driver', 'native');
      }
      signature = key;
    } catch {
      stop();
      tracks.forEach(({ element }) => element.setAttribute('data-mobile-scroll-driver', 'raf'));
    }
  }
  media.addEventListener('change', () => {
    if (!media.matches) {
      stop();
      definition?.tracks.forEach(({ element }) => element.setAttribute('data-mobile-scroll-driver', 'desktop'));
    }
  });
  reducedMotion.addEventListener('change', () => refresh());
  return { refresh, active: () => animations.length > 0 };
}
